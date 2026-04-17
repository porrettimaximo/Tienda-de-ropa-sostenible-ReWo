-- Function to decrement stock atomically and handle concurrency
CREATE OR REPLACE FUNCTION process_order_items(
    p_order_id UUID,
    p_items JSONB
) RETURNS VOID AS $$
DECLARE
    item RECORD;
    v_stock INT;
BEGIN
    -- We loop through items and decrement stock
    FOR item IN SELECT * FROM jsonb_to_recordset(p_items) AS x(variant_id UUID, quantity INT, unit_price NUMERIC, product_id UUID, line_total NUMERIC)
    LOOP
        -- Lock the row for update to prevent concurrent changes
        SELECT stock INTO v_stock 
        FROM product_variants 
        WHERE id = item.variant_id 
        FOR UPDATE;

        IF v_stock IS NULL THEN
            RAISE EXCEPTION 'Variante % no encontrada', item.variant_id;
        END IF;

        IF v_stock < item.quantity THEN
            RAISE EXCEPTION 'Stock insuficiente para la variante % (disponible: %, pedido: %)', item.variant_id, v_stock, item.quantity;
        END IF;

        -- Decrement stock
        UPDATE product_variants 
        SET stock = stock - item.quantity 
        WHERE id = item.variant_id;

        -- Insert into order_items (optional, we could do this from Python too, 
        -- but doing it here ensures the whole checkout step is as atomic as possible for stock)
        INSERT INTO order_items (id, order_id, product_id, variant_id, quantity, unit_price, total_price)
        VALUES (gen_random_uuid(), p_order_id, item.product_id, item.variant_id, item.quantity, item.unit_price, item.line_total);
    END LOOP;
END;
$$ LANGUAGE plpgsql;

package store

import (
	"context"
	"database/sql"
)

// keyAvailability counts unclaimed keys after covering existing unpaid and
// paid orders. Pending Checkout Sessions hold stock until Stripe expires them.
func keyAvailability(ctx context.Context, tx *sql.Tx, productID int64) (total, available int64, err error) {
	var unclaimed, owed int64
	err = tx.QueryRowContext(ctx,
		`SELECT COUNT(*), COALESCE(SUM(CASE WHEN claimed_at IS NULL THEN 1 ELSE 0 END), 0)
		 FROM product_keys WHERE product_id = ?`, productID).Scan(&total, &unclaimed)
	if err != nil {
		return 0, 0, err
	}
	err = tx.QueryRowContext(ctx,
		`SELECT COALESCE(SUM(oi.quantity -
		   (SELECT COUNT(*) FROM product_keys k WHERE k.claimed_order_item_id = oi.id)), 0)
		 FROM order_items oi JOIN orders o ON o.id = oi.order_id
		 WHERE oi.product_id = ? AND o.status IN ('pending','paid','fulfilled')`, productID).Scan(&owed)
	if err != nil {
		return 0, 0, err
	}
	return total, unclaimed - owed, nil
}

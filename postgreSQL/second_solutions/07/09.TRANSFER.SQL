CREATE OR REPLACE PROCEDURE 
	sp_withdraw_money(
		sender_id INT,
		receiver_id INT,
		amount NUMERIC
	)
AS
$$
DECLARE 
	current_balance NUMERIC;
BEGIN
	current_balance := (SELECT balance FROM accounts WHERE id = sender_id);
	
	IF current_balance >= amount THEN
		CALL sp_withdraw_money(sender_id, amount);
		CALL sp_deposit_money(receiver_id, amount);
	ELSE RAISE NOTICE 'Insufficient balance to withdraw %', amount;
	END IF;		
END;
$$
LANGUAGE plpgsql;
select * from accounts;

select * from accounts where account_number='1709270950479480';

select * from users;

UPDATE accounts
SET balance = 0.00
WHERE account_number = '1709270950479480';

select * from transactions;

delete from transactions where transaction_id = 20;
select * from transactions t, accounts a
where a.account_id = t.account_id;

select * from transaction_authorizations;

select * from users u, accounts a_ where u.user_id = a_.user_id;

select * from user_profile_update_request;

select * from accounts 
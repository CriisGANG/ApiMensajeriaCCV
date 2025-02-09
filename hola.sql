<IfModule mod_sql.c>
  SQLBackend               mysql
  SQLEngine                on
  SQLAuthenticate          on
  SQLLogFile               /var/log/proftpd/sql.log
  SQLConnectInfo           proftpd@localhost usuari usuari123
  SQLUserInfo              users userid passwd uid gid homedir shell
  SQLGroupInfo             groups groupname gid members
  SQLAuthTypes             Crypt Plaintext
  SQLMinUserUID            1000
  SQLMinUserGID            1000
</IfModule>

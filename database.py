import pymysql.cursors
import sqlalchemy as database
from werkzeug.security import generate_password_hash, check_password_hash
import datetime


class API_Mensajeria(object):
    def conecta(self):
        # Conexion a la BBDD del servidor mySQL
        self.db = pymysql.connect(host='localhost',
                                  user='root',
                                  db='whatsapp2425',
                                  charset='utf8mb4',
                                  autocommit=True,
                                  cursorclass=pymysql.cursors.DictCursor)
        self.cursor = self.db.cursor()

    def desconecta(self):
        self.db.close()

    def carregaUsuaris(self):
        sql = "SELECT * from usuarisclase"
        self.cursor.execute(sql)
        ResQuery = self.cursor.fetchall()
        return ResQuery

    def carregaGrups(self):
        sql = "SELECT * FROM Groups"
        self.cursor.execute(sql)
        ResQuery = self.cursor.fetchall()
        return ResQuery

    def verificar_usuario(self, username, password):
        sql = "SELECT count(*) from usuarisclase WHERE username='"+username+"'"
        self.cursor.execute(sql)
        ResQuery = self.cursor.fetchone()
        if ResQuery['count(*)'] == 1:
            sql = "SELECT password FROM usuarisclase WHERE username = %s"
            self.cursor.execute(sql, (username,))
            ResQuery = self.cursor.fetchone()
            resposta = check_password_hash(ResQuery['password'], password)
        else:
            resposta = False
        return resposta

    def get_user_id(self, username):
        sql = "SELECT id FROM usuarisclase WHERE username = %s"
        self.cursor.execute(sql, (username,))
        user = self.cursor.fetchone()
        return user['id'] if user else None

    def get_username(self, user_id):
        sql = "SELECT username FROM usuarisclase WHERE id = %s"
        self.cursor.execute(sql, (user_id,))
        user = self.cursor.fetchone()
        return user['username'] if user else None

    def getGroup(self, groupId):
        sql = "SELECT id, name FROM Groups WHERE id = %s"
        self.cursor.execute(sql, (groupId,))
        group = self.cursor.fetchone()
        return group if group else None

    def getGroupName(self, groupId):
        sql = "SELECT id FROM Groups WHERE id = %s"
        self.cursor.execute(sql, (groupId,))
        group = self.cursor.fetchone()
        return group['id'] if group else None

    def cargar_conversacion(self, logged_in_user_id, selected_user_id):
        sql = """
        SELECT * FROM messages 
        WHERE (sender_id = %s AND receiver_id = %s) 
        OR (sender_id = %s AND receiver_id = %s)
        ORDER BY created_at
        """
        # Debugging statement
        print(f"Executing SQL: {sql}")
        print(f"With parameters: {logged_in_user_id}, {
              selected_user_id}, {selected_user_id}, {logged_in_user_id}")

        self.cursor.execute(
            sql, (logged_in_user_id, selected_user_id, selected_user_id, logged_in_user_id))
        ResQuery = self.cursor.fetchall()

        # Debugging statement
        print(f"SQL Query Result: {ResQuery}")

        return ResQuery

    def cargarConversacionGrupo(self, groupId):
        sql = """
        SELECT m.*, u.username as sender_username FROM messages m
        JOIN usuarisclase u ON m.sender_id = u.id
        WHERE m.group_id = %s
        ORDER BY m.created_at
        """
        self.cursor.execute(sql, (groupId,))
        ResQuery = self.cursor.fetchall()
        return ResQuery

    def insertar_mensaje(self, sender_id, receiver_id, content):
        sql = "INSERT INTO messages (sender_id, receiver_id, content, created_at) VALUES (%s, %s, %s, NOW())"
        self.cursor.execute(sql, (sender_id, receiver_id, content))
        self.db.commit()
        
    def insertarMensajeGrupo(self, sender_id, groupId, content):
        sql = "INSERT INTO messages (sender_id, group_Id, content, created_at) VALUES (%s, %s, %s, NOW())"
        self.cursor.execute(sql, (sender_id, groupId, content))
        self.db.commit()

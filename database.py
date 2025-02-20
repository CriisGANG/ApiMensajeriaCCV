import pymysql.cursors
from fastapi import Depends

import sqlalchemy as database
from werkzeug.security import generate_password_hash, check_password_hash
import datetime
from passlib.context import CryptContext
import pymysqlpool
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class API_Mensajeria(object):
    def conecta(self):
        # Conexion a la BBDD del servidor mySQL
        self.db = pymysql.connect(host='localhost',  # 192.168.48.123
                                  user='root',  # virginia
                                  db='whatsapp2425',
                                  charset='utf8mb4',
                                  autocommit=True,
                                  cursorclass=pymysql.cursors.DictCursor)
        self.cursor = self.db.cursor()
        
    def desconecta(self):
        self.db.close()

    def carregaUsuaris(self):
        sql = "SELECT id, username, user_profile_picture_url, user_bg_picture_url from usuarisclase"
        self.cursor.execute(sql)
        ResQuery = self.cursor.fetchall()
        return ResQuery
    
    def carregaUsuari(self, idUsuario  ):
        try:
            config = {
                "host": "localhost",
                "user": "root",
                "database": "whatsapp2425",
                "autocommit": True,
                "charset": "utf8mb4",
                "cursorclass": pymysql.cursors.DictCursor
            }
            pool = pymysqlpool.ConnectionPool(size=10, name='mypool', **config)
            conn = pool.get_connection()
            with conn.cursor() as cursor:
                sql = "SELECT id, username, user_profile_picture_url, user_bg_picture_url from usuarisclase where id = %s"
                cursor.execute(sql, (idUsuario,))
                result = cursor.fetchone()
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
        finally:
            if conn:
                conn.close()
            return result
    
    def carregaGrups(self, idUser):
        # sql = "SELECT * FROM Groups"
        sql = "SELECT g.name, g.id FROM Users u JOIN group_members gm ON gm.user_id = u.id JOIN groups g ON g.id = gm.group_id WHERE u.id = %s"
        self.cursor.execute(sql, (idUser))
        ResQuery = self.cursor.fetchall()
        return ResQuery

    def verificar_usuario(self, username, password):
        sql = "SELECT id, password FROM usuarisclase WHERE username = %s"
        self.cursor.execute(sql, (username,))
        ResQuery = self.cursor.fetchone()
        if ResQuery and ResQuery['password']:
            hashed_password = ResQuery['password']
            if hashed_password:
                try:
                    return pwd_context.verify(password, hashed_password)
                except (ValueError, AttributeError):
                    # Si el hash no es reconocido o hay un error de atributo, intenta verificarlo con el método anterior
                    return check_password_hash(hashed_password, password)
        return False

    def get_user_id(self, username):
        sql = "SELECT id FROM usuarisclase WHERE username = %s ;"
        self.cursor.execute(sql, (username,))
        user = self.cursor.fetchone()
        print("PEPEEEEE", user)
        return user['id'] if user else None

    def get_username(self, user_id):
        sql = "SELECT username FROM usuarisclase WHERE id = %s"
        self.cursor.execute(sql, (user_id,))
        user = self.cursor.fetchone()
        return user['username'] if user else None

    def getGroup(self, groupId):
        sql = "SELECT id, name FROM groups WHERE id = %s"
        self.cursor.execute(sql, (groupId,))
        group = self.cursor.fetchone()
        return group if group else None

    def getGroupName(self, groupId):
        sql = "SELECT id FROM Groups WHERE id = %s"
        self.cursor.execute(sql, (groupId,))
        group = self.cursor.fetchone()
        return group['id'] if group else None

    def cargar_conversacion(self, logged_in_user_id, selected_user_id, since=None):
        self.conecta()
        sql = """
        SELECT messages.*, sender.username AS sender_username, receiver.username AS receiver_username 
        FROM messages JOIN usuarisclase sender ON sender.id = messages.sender_id 
        JOIN usuarisclase receiver ON receiver.id = messages.receiver_id 
        WHERE (messages.sender_id = %s AND messages.receiver_id = %s) OR (messages.sender_id = %s AND messages.receiver_id = %s) ORDER BY messages.created_at;
        """
        self.cursor.execute(sql, (logged_in_user_id, selected_user_id, selected_user_id, logged_in_user_id))
        result = self.cursor.fetchall()
        self.cursor.close()
        self.desconecta()
        return result
    
    
        # sql = """
        #     SELECT 
        #     messages.*,
        #     sender.username AS sender_username,
        #     receiver.username AS receiver_username
        # FROM 
        #     messages
        # JOIN 
        #     usuarisclase sender ON sender.id = messages.sender_id
        # JOIN 
        #     usuarisclase receiver ON receiver.id = messages.receiver_id
        # WHERE 
        #     (messages.sender_id = %s AND messages.receiver_id = %s)
        #     OR (messages.sender_id = %s AND messages.receiver_id = %s)
        # """
        # params = [logged_in_user_id, selected_user_id, selected_user_id, logged_in_user_id]
        # if since:
        #     sql += " AND messages.created_at > %s"
        #     params.append(since)
        # sql += " ORDER BY messages.created_at"  
        # # print(since)

        # self.cursor.execute(sql, params)
        # ResQuery = self.cursor.fetchall()
        # return ResQuery

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

    def insertar_mensaje(self, sender_id, receiver_id, content, status):
        sql = """
        INSERT INTO messages (sender_id, receiver_id, content, status, created_at) 
        VALUES (%s, %s, %s, %s, NOW())
        """
        self.cursor.execute(sql, (sender_id, receiver_id, content, status))
        self.db.commit()

    def insertarMensajeGrupo(self, sender_id, groupId, content):
        sql = "INSERT INTO messages (sender_id, group_Id, content, created_at) VALUES (%s, %s, %s, NOW())"
        self.cursor.execute(sql, (sender_id, groupId, content))
        self.db.commit()

    def get_group_members(self, groupId):
        sql = """
        SELECT u.username FROM usuarisclase u
        JOIN group_members gm ON u.id = gm.user_id
        WHERE gm.group_id = %s
        """
        self.cursor.execute(sql, (groupId,))
        return self.cursor.fetchall()

    def actualizar_estado_mensaje(self, message_id, new_status):
        sql = "UPDATE messages SET status = %s WHERE id = %s"
        self.cursor.execute(sql, (new_status, message_id))
        self.db.commit()

    def get_last_message_id(self):
        sql = "SELECT id FROM messages ORDER BY id DESC LIMIT 1"
        self.cursor.execute(sql)
        message = self.cursor.fetchone()
        return message['id'] if message else None

    def actualizar_foto_perfil(self, user_id, profile_picture_url):
        sql = "UPDATE usuarisclase SET user_profile_picture_url = %s WHERE id = %s"
        self.cursor.execute(sql, (profile_picture_url, user_id))
        self.db.commit()

    def get_user_profile_picture_url(self, user_id):
        sql = "SELECT user_profile_picture_url FROM usuarisclase WHERE id = %s"
        self.cursor.execute(sql, (user_id,))
        user = self.cursor.fetchone()
        return user['user_profile_picture_url'] if user else None

    def actualizar_imagen_fondo(self, user_id, bg_picture_url):
        sql = "UPDATE usuarisclase SET user_bg_picture_url = %s WHERE id = %s"
        self.cursor.execute(sql, (bg_picture_url, user_id))
        self.db.commit()

    def get_user_bg_picture_url(self, user_id):
        sql = "SELECT user_bg_picture_url FROM usuarisclase WHERE id = %s"
        self.cursor.execute(sql, (user_id,))
        user = self.cursor.fetchone()
        return user['user_bg_picture_url'] if user else None

    def newGroup(self, name, idUser):
        sql = "INSERT INTO Groups (Name, Admin_ID) VALUES (%s, %s)"
        self.cursor.execute(sql, (name, idUser))
        group_id = self.cursor.lastrowid
        self.db.commit()        
        return group_id

    def addUsersToGroup(self, user_id, group_id, is_admin):
        sql = "INSERT INTO group_members (group_id, user_id, is_admin) VALUES (%s, %s, %s)"
        self.cursor.execute(sql, (group_id, user_id, is_admin))
        self.db.commit()

    def get_message_by_id(self, message_id):
        sql = "SELECT * FROM messages WHERE id = %s"
        self.cursor.execute(sql, (message_id,))
        return self.cursor.fetchone()
    
    def getConversacionesByUser(self, userId):
        sql = """
            
            (SELECT 
            'user' AS interaction_type,

            CASE 
                WHEN m.sender_id = %s THEN m.receiver_id
                ELSE m.sender_id
            END AS interaction_id,
            MAX(m.created_at) AS last_interaction,
            (SELECT content FROM messages WHERE id = MAX(m.id)) AS last_message_content
         FROM 
            messages m
        JOIN usuarisclase u1 ON u1.id = m.sender_id
        JOIN usuarisclase u2 ON u2.id = m.receiver_id
         WHERE 
            m.sender_id = %s OR m.receiver_id = %s
         GROUP BY 
            interaction_id)

        UNION ALL

        (SELECT 
            
            'group' AS interaction_type,
            m.group_id AS interaction_id,
            MAX(m.created_at) AS last_interaction,
            (SELECT content FROM messages WHERE id = MAX(m.id)) AS last_message_content
         FROM 
            messages m
         JOIN 
            group_members gm ON m.group_id = gm.group_id
         WHERE 
            gm.user_id = %s
         GROUP BY 
            m.group_id)

        ORDER BY 
            last_interaction DESC;"""
        self.cursor.execute(sql, (userId,userId,userId,userId))
        return self.cursor.fetchall()
    
    def isAdmin(self, user_id, group_id):
        sql = "SELECT is_admin FROM group_members WHERE user_id =%s AND group_id =%s"
        self.cursor.execute(sql, (user_id, group_id))
        ResQuery = self.cursor.fetchone()
        print(ResQuery)
        return ResQuery['is_admin'] if ResQuery else None # La idea es mirar si el is_admin es 0 o 1. Si es 1, entonces el usuario tendrá unas configuraciones extra: para hacer admin a otra persona o expulsar a alguien

    def getGroupMembersExceptYou(self, groupId, userId):
        sql = """
        SELECT u.id, u.username FROM usuarisclase u
        JOIN group_members gm ON u.id = gm.user_id
        WHERE gm.group_id = %s AND u.id != %s
        """
        self.cursor.execute(sql, (groupId, userId))
        return self.cursor.fetchall()
    
    def leaveGroup(self, user_id, group_id):
        sql = "DELETE FROM group_members WHERE user_id = %s AND group_id = %s"
        self.cursor.execute(sql, (user_id, group_id))
        self.db.commit()
        
    def convertToAdmin(self, user_id, group_id):
        sql = "UPDATE group_members SET is_admin = 1 WHERE user_id = %s AND group_id = %s"
        self.cursor.execute(sql, (user_id, group_id))
        self.db.commit()
        
    def isOwner(self, admin_id, group_id):
        sql = "SELECT COUNT(*) as isOwner FROM Groups WHERE admin_id = %s AND id = %s"
        self.cursor.execute(sql, (admin_id, group_id))
        ResQuery = self.cursor.fetchone()
        return ResQuery

    def delete_group(self, group_id):
        sql = "DELETE FROM groups WHERE id = %s"
        self.cursor.execute(sql, (group_id,))
        self.db.commit()

    def getUsersNotInGroup(self, group_id):
        sql = """
        SELECT u.id, u.username FROM usuarisclase u
        WHERE u.id NOT IN (SELECT gm.user_id FROM group_members gm WHERE gm.group_id = %s)
        """
        self.cursor.execute(sql, (group_id,))
        ResQuery = self.cursor.fetchall()
        return ResQuery

    def demoteToMember(self, user_id, group_id):
        sql = "UPDATE group_members SET is_admin = 0 WHERE user_id = %s AND group_id = %s"
        self.cursor.execute(sql, (user_id, group_id))
        self.db.commit()
import pymysql.cursors
import sqlalchemy as database
from werkzeug.security import generate_password_hash,check_password_hash


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
        sql="SELECT * from usuarisclase"
        self.cursor.execute(sql)
        ResQuery=self.cursor.fetchall()
        return ResQuery
    
    def verificar_usuario(self, username, password):
        sql="SELECT count(*) from usuarisclase WHERE username='"+username+"'"
        self.cursor.execute(sql)
        ResQuery=self.cursor.fetchone()
        if ResQuery['count(*)']==1:
            sql = "SELECT password FROM usuarisclase WHERE username = %s"
            self.cursor.execute(sql, (username,))
            ResQuery = self.cursor.fetchone()
            resposta=check_password_hash(ResQuery['password'],password)
        else:
            resposta=False
        return resposta
        
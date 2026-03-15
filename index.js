const { Client } = require('pg');
const http = require('http');

// Render에 설정한 DATABASE_URL 환경변수를 가져옵니다.
const connectionString = process.env.DATABASE_URL;

const server = http.createServer(async (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');

  const client = new Client({
    connectionString: connectionString,
    ssl: {
      rejectUnauthorized: false // Neon(PostgreSQL) 연결 시 SSL 설정이 필요합니다.
    }
  });

  try {
    await client.connect();
    
    // '홍길동'이라는 이름을 가진 레코드를 조회하는 쿼리
    const query = "SELECT name FROM test WHERE name = '최진호' LIMIT 1";
    const result = await client.query(query);

    if (result.rows.length > 0) {
      const name = result.rows[0].name;
      res.end(`<h1>HELLO ${name}</h1>`);
    } else {
      res.end('<h1>데이터를 찾을 수 없습니다.</h1>');
    }
  } catch (err) {
    console.error(err);
    res.statusCode = 500;
    res.end('서버 에러가 발생했습니다.');
  } finally {
    await client.end();
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

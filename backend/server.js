const express = require('express')
const app = express()
const PORT = 5000

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT} 에서 서버 실행중`)
})


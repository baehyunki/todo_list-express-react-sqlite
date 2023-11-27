/**
 * 에러 핸들러 함수
 * @param {Error} err - 발생한 에러 객체
 * @param {Object} req - 요청 객체
 * @param {Object} res - 응답 객체
 * @param {Function} next - 다음 미들웨어 함수
 */
const errorHandler = (err, req, res, next) => {
  // 응답 상태 코드를 설정한다. 상태 코드가 없을 경우 500을 사용한다.
  const statusCode = res.statusCode ? res.statusCode : 500

  // 응답 상태 코드를 설정한다.
  res.status(statusCode)

  // 에러 메시지와 스택 정보를 응답으로 전송한다.
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  })
}

module.exports = { errorHandler }

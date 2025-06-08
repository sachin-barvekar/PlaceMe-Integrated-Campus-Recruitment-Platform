const { spawn } = require('child_process')
const path = require('path')

function predictPlacementScore(data) {
  return new Promise((resolve, reject) => {
    const py = spawn('python', [path.join(__dirname, 'score_predictor.py')])

    let result = ''
    let error = ''

    py.stdout.on('data', chunk => {
      result += chunk.toString()
    })

    py.stderr.on('data', chunk => {
      error += chunk.toString()
    })

    py.on('close', code => {
      if (code !== 0 || error) {
        return reject(new Error(`Python error: ${error}`))
      }
      try {
        resolve(JSON.parse(result))
      } catch (err) {
        reject(err)
      }
    })

    py.stdin.write(JSON.stringify(data))
    py.stdin.end()
  })
}

module.exports = predictPlacementScore

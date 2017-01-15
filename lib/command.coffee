runner = ->
  pjson      = require('../package.json')
  version    = pjson.version
  cmpserver = require './cmpserver'
  resolve    = require('path').resolve
  opts       = require 'opts'
  debug      = false;

  opts.parse [
    {
      short: "v"
      long:  "version"
      description: "Show the version"
      required: false
      callback: ->
        console.log version
        process.exit(1)
    }
    {
      short: "p"
      long:  "port"
      description: "Specify the port"
      value: true
      required: false
    }
    {
      short: "s"
      long:  "start"
      description: "start cmpAPP or not, default set true to start cmp, other value not start"
      value: true
      required: false
    }
    {
      short: "x"
      long: "exclusions"
      description: "Exclude files by specifying an array of regular expressions. Will be appended to default value which is []",
      required: false,
      value: true
    }
    {
      short: "d"
      long: "debug"
      description: "Additional debugging information",
      required: false,
      callback: -> debug = true
    }
    
  ].reverse(), true

  port = opts.get('port') || 80
  start = opts.get('start') || "true"
  exclusions = opts.get('exclusions') || []
  exts = (opts.get('exts') || '').split ' '
  usePolling = opts.get('usepolling') || false
  path = resolve(process.argv[2] || '.')

  server = cmpserver.createServer({
    port: port
    start: start
    debug: debug
    exclusions: exclusions,
    exts: exts
    path: path
  })
  

  
  console.log "Starting cmpserver v#{version} for #{path} ......"

module.exports =
  run: runner

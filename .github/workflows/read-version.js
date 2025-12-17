const fs = require('fs')
const version = require('../../sdk-generation-configuration/version.json')

fs.appendFileSync(
    process.env.GITHUB_ENV, 
    `version=${version.edgraphPlatformVersion.major}.${version.edgraphPlatformVersion.minor}.${version.edgraphPlatformVersion.patch}`)
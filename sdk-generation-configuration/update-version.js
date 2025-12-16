const fs = require('fs')
const { updateAllConfigsToLatesVersion } = require('./update-config-version')

function updateVersion() {
    const version = JSON.parse(fs.readFileSync('version.json'), "utf8")
    
    console.log("EdGraph platform version: ", version.edgraphPlatformVersion)
    
    version.edgraphPlatformVersion.patch += 1
    
    console.log("Updated EdGraph platform version: ", version.edgraphPlatformVersion)
    
    fs.writeFileSync("config.json", config)

    updateAllConfigsToLatesVersion(config.edgraphPlatformVersion)
}

updateVersion()

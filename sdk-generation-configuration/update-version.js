const fs = require('fs')
const { updateAllConfigsToLatesVersion } = require('./update-config-version')
const path = require('path')

function updateVersion() {
    const versionFile = path.join(process.cwd(), 'sdk-generation-configuration/version.json')
    const version = JSON.parse(fs.readFileSync(versionFile), "utf8")
    
    console.log("EdGraph platform version: ", version.edgraphPlatformVersion)
    
    version.edgraphPlatformVersion.patch += 1
    
    console.log("Updated EdGraph platform version: ", version.edgraphPlatformVersion)
    
    fs.writeFileSync(versionFile, config)

    updateAllConfigsToLatesVersion(config.edgraphPlatformVersion)
}

updateVersion()

const fs = require('fs')
const { updateAllConfigsToLatesVersion } = require('./update-config-version')
const path = require('path')

function updateVersion() {
    const versionFilePath = path.join(process.cwd(), 'sdk-generation-configuration/version.json')
    const version = JSON.parse(fs.readFileSync(versionFilePath), "utf8")
    
    console.log("EdGraph platform version: ", version.edgraphPlatformVersion)
    
    version.edgraphPlatformVersion.patch += 1
    
    console.log("Updated EdGraph platform version: ", version.edgraphPlatformVersion)
    
    fs.writeFileSync(versionFilePath, JSON.stringify(version, null, 2), 'utf8')

    updateAllConfigsToLatesVersion(version.edgraphPlatformVersion)
}

updateVersion()

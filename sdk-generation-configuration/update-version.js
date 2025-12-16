import fs from 'fs'
import { updateAllConfigsToLatesVersion } from './update-config-version'

function updateVersion() {
    const config = JSON.parse(fs.readFileSync('config.json'), "utf8")
    
    console.log("EdGraph platform version: ", config.edgraphPlatformVersion)
    
    config.edgraphPlatformVersion.patch += 1
    
    console.log("Updated EdGraph platform version: ", config.edgraphPlatformVersion)
    
    fs.writeFileSync("config.json", config)

    updateAllConfigsToLatesVersion(config.edgraphPlatformVersion)
}

updateVersion()

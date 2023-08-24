/**
 * The bellow code is a JavaScript function that checks the status of dependencies in a package.json
 * file and prints whether they are up to date, outdated, or not found.
 * @param dependency - The `dependency` parameter represents the name of a specific dependency that you
 * want to check the status of.
 * @returns The `checkDependencyStatus` function returns a string indicating the status of a
 * dependency. It can return one of the following values:
 */
import axios from "axios"
import chalk from "chalk"
import fs from "fs"

async function checkDependencyStatus(dependency) {
  try {
    const response = await axios.get(`https://registry.npmjs.org/${dependency}`)
    const latestVersion = response.data["dist-tags"].latest
    const packageJsonPath = `./node_modules/${dependency}/package.json`
    const packageJsonContent = fs.readFileSync(packageJsonPath, "utf8")
    const { version: installedVersion } = JSON.parse(packageJsonContent)

    if (installedVersion === latestVersion) {
      return "Up to date"
    } else {
      return `Outdated (latest: ${latestVersion})`
    }
  } catch (error) {
    return "Not found"
  }
}

async function checkAllDependencies() {
  const packageJsonContent = fs.readFileSync("./package.json", "utf8")
  const { dependencies } = JSON.parse(packageJsonContent)

  const outdatedDependencies = []

  for (const dependency of Object.keys(dependencies)) {
    const status = await checkDependencyStatus(dependency)
    if (status !== "Up to date") {
      outdatedDependencies.push(`${dependency}: ${status}`)
    }
  }

  return outdatedDependencies
}

async function main() {
  const outdatedDependencies = await checkAllDependencies()

  if (outdatedDependencies.length === 0) {
    console.log(chalk.green("Dependency Status: Clear"))
  } else {
    console.log(chalk.yellow("Dependency Status: Warning"))
    outdatedDependencies.forEach((dependency) => {
      console.log(chalk.yellow(dependency))
    })
  }
}

main()
export default main

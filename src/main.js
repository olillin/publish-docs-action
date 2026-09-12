import * as core from '@actions/core'
import path from 'node:path'
import fs from 'node:fs'
import { Blob } from 'node:buffer'
import { parseBoolean } from './util.js'

/**
 * The main function for the action.
 *
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run() {
  try {
    const pathname = core.getInput('path')
    const baseUrl = core.getInput('base_url') || 'https://newdocs.olillin.com'
    const categorySlug = core.getInput('category_slug')
    const documentSlug = core.getInput('document_slug')
    const revisedAt = core.getInput('revised_at')
    const ignoreConflicts = parseBoolean(core.getInput('ignore_conflicts'))

    // Debug logs are only output if the `ACTIONS_STEP_DEBUG` secret is true

    // Compile form data
    const formData = new FormData()

    const buffer = fs.readFileSync(pathname)
    const blob = new Blob([buffer])
    const filename = path.basename(pathname)
    formData.append('file', blob, filename)
    core.debug(`Added file from ${pathname}`)

    if (revisedAt) {
      formData.set('revised-at', revisedAt)
      core.debug(`Set revised at: ${revisedAt}`)
    }

    // Send POST request
    core.debug(
      `Creating URL at '${baseUrl}' with category '${categorySlug}' and document '${documentSlug}`
    )
    const url = new URL(categorySlug + '/' + documentSlug, baseUrl)
    const response = await fetch(url, {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      if (response.status === 409 && ignoreConflicts) {
        core.debug(
          'Failed to upload revision because of conflict, ignoring because ignore_conflicts is enabled'
        )
        return
      }

      throw new Error(`Failed to upload revision: ${response}`)
    }

    const location = response.headers.get('location')
    if (!location) {
      throw new Error('Did not receive location in response headers')
    }

    // Set outputs for other workflow steps to use
    core.setOutput('location', location)
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}

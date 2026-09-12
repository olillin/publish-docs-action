import * as core from '@actions/core'
import path from 'node:path'
import fs from 'node:fs'
import { Blob } from 'node:buffer'

/**
 * The main function for the action.
 *
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run() {
  try {
    const pathname = core.getInput('path')
    const baseUrl = core.getInput('base_url')
    const categoryStub = core.getInput('category_stub')
    const documentStub = core.getInput('document_stub')
    const revisedAt = core.getInput('revised_at')

    // Debug logs are only output if the `ACTIONS_STEP_DEBUG` secret is true
    core.debug(`Revised at: ${revisedAt} (${typeof revisedAt})`)

    // Compile form data
    const formData = new FormData()

    const buffer = fs.readFileSync(pathname)
    const blob = new Blob([buffer])
    const filename = path.basename(pathname)
    formData.append('file', blob, filename)

    if (revisedAt) {
      formData.set('revised-at', revisedAt)
    }

    // Send POST request
    const url = new URL(baseUrl, categoryStub, documentStub)
    const response = await fetch(url, {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
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

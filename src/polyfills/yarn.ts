import * as core from '@actions/core';
import * as exec from '@actions/exec';

export async function polyfillYarn() {
	const isYarnInstalled = (await exec.exec('yarn', ['--version'], { ignoreReturnCode: true })) === 0;

	if (isYarnInstalled) {
		core.info('Yarn already installed.');
		return;
	}

	core.info('Installing Yarn...');

	const isNpmInstalled = (await exec.exec('npm', ['--version'], { ignoreReturnCode: true })) === 0;

	if (!isNpmInstalled) {
		core.info('Installing NPM...');

		await exec.exec('sudo', ['apt-get', 'install', 'npm', '-y']);
	}

	await exec.exec('sudo', ['npm', 'install', '-g', 'yarn']);

	core.debug('Adding Yarn to PATH...');

	core.addPath('/usr/local/share/.config/yarn/global/node_modules/.bin');

	core.info('Yarn installed.');
}

#!/usr/bin/env node

import { loadConfig } from 'c12';
import { defineCommand, runMain } from 'citty';
import { FastMCP } from 'fastmcp';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';

import { fetchSSEAnswer } from './askAgent';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const pkgConfig = (
	await loadConfig({
		cwd: join(__dirname, '..'),
		configFile: 'package.json',
	})
).config;

console.log(pkgConfig);

const main = defineCommand({
	meta: {
		name: pkgConfig.name,
		version: pkgConfig.version,
		description: pkgConfig.description,
	},
	args: {
		http: {
			type: 'boolean',
			description: '使用 HTTP 传输模式（默认为 stdio 模式）',
			required: false,
		},
		port: {
			type: 'string',
			description: '指定 HTTP 服务器监听端口',
			required: false,
			default: '9200',
		},
	},
	run({ args }) {
		const { http, port } = args;
		const versions = pkgConfig.version.split('.');
		const server = new FastMCP({
			name: pkgConfig.mcpName,
			version: `${Number(versions[0])}.${Number(versions[1])}.${Number(versions[2])}`,
		});

		server.addTool({
			name: '加法计算器',
			description: '计算两个数字的和',
			parameters: z.object({
				a: z.number().describe('第一个数字'),
				b: z.number().describe('第二个数字'),
			}),
			execute: async (args) => {
				return {
					content: [
						{
							type: 'text',
							text: String(args.a + args.b),
						},
					],
				};
			},
		});

		server.addTool({
			name: '乘法计算器',
			description: '计算两个数字的乘积',
			parameters: z.object({
				a: z.number().describe('第一个数字'),
				b: z.number().describe('第二个数字'),
			}),
			execute: async (args) => {
				const answer = await fetchSSEAnswer('http://0.0.0.0:9100/sse/chat', {
					query: `计算 ${args.a} 和 ${args.b} 的乘积`,
				});

				return {
					content: [
						{
							type: 'text',
							text: answer,
						},
					],
				};
			},
		});

		if (http) {
			server.start({
				transportType: 'httpStream',
				httpStream: {
					host: '0.0.0.0',
					port: parseInt(port, 10) || 3000,
				},
			});
			console.log(`🚀 MCP 服务器已启动 (HTTP 模式) - 端口: ${port || 3000}`);
		} else {
			server.start({ transportType: 'stdio' });
		}
	},
});

// runMain(main).catch();

const answer = await fetchSSEAnswer('http://0.0.0.0:9100/sse/chat', {
	query: `计算 2 和 3 的乘积`,
});

console.log(answer);

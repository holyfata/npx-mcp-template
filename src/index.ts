#!/usr/bin/env node

/**
 * NPX MCP Template - Model Context Protocol Server
 * 
 * 这是一个基于 FastMCP 的 MCP 服务器模板，提供了一个简单的数学加法工具。
 * MCP (Model Context Protocol) 是一个用于 AI 模型与外部工具和资源交互的协议。
 * 
 * 主要功能：
 * - 支持 HTTP 和 stdio 两种传输方式
 * - 提供可扩展的工具注册机制
 * - 使用 Zod 进行参数验证
 */

import { z } from "zod";
import { FastMCP } from "fastmcp";
import { program } from "commander";
import { add } from "./add";

/**
 * 应用程序主入口函数
 * 
 * 负责：
 * 1. 解析命令行参数
 * 2. 初始化 MCP 服务器
 * 3. 注册工具和处理器
 * 4. 启动服务器（HTTP 或 stdio 模式）
 */
export const main = () => {
	// 配置命令行参数解析
	program
		.option('--http', '使用 HTTP 传输模式（默认为 stdio 模式）')
		.option('-p, --port <number>', '指定 HTTP 服务器监听端口', '3000')
		.argument('<string>'); // 保留原有参数结构

	// 解析命令行参数
	program.parse();

	// 获取解析后的选项
	const options = program.opts();

	/**
	 * 创建 FastMCP 服务器实例
	 * FastMCP 是一个轻量级的 MCP 服务器框架
	 */
	const server = new FastMCP({
		name: "NPX MCP 服务器", // 服务器名称
		version: "1.0.0",        // 服务器版本
	});

	/**
	 * 注册加法工具
	 * 
	 * 这是一个示例工具，展示了如何：
	 * - 定义工具名称和描述
	 * - 使用 Zod 验证输入参数
	 * - 实现异步执行逻辑
	 */
	server.addTool({
		name: "Add Tool",                    // 工具名称
		description: "Add two numbers",      // 工具描述
		parameters: z.object({               // 参数验证模式
			a: z.number(),                   // 第一个数字参数
			b: z.number(),                   // 第二个数字参数
		}),
		execute: async (args) => {           // 异步执行函数
			return add(args);                // 调用加法实现
		},
	});

	/**
	 * 根据命令行选项启动服务器
	 * 
	 * 支持两种传输模式：
	 * 1. HTTP Stream: 通过 HTTP 协议提供服务，适合远程访问
	 * 2. stdio: 通过标准输入输出通信，适合本地集成
	 */
	if (options.http) {
		// HTTP 模式：启动 HTTP 服务器
		server.start({
			transportType: "httpStream",
			httpStream: {
				host: "0.0.0.0",                    // 监听所有网络接口
				port: parseInt(options.port) || 3000, // 使用指定端口或默认 3000
			},
		});
		console.log(`🚀 MCP 服务器已启动 (HTTP 模式) - 端口: ${options.port || 3000}`);
	} else {
		// stdio 模式：通过标准输入输出通信
		server.start({
			transportType: "stdio",
		});
	}
};

// 启动应用程序
main();
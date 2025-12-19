import fs from "node:fs";

/**
 * 从 SSE 流中提取 answer 类型的 content
 * @param url - 请求的 URL
 * @param postData - POST 请求的数据
 * @returns 返回 answer 类型数据的 content 字段
 */
export const fetchSSEAnswer = async (
	url: string,
	postData: Record<string, unknown>,
): Promise<string> => {
	try {
		// 发起 POST 请求
		const response = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(postData),
		});

		// 判断响应状态是否成功（2xx 状态码）
		if (!response.ok) {
			throw new Error(`请求失败：${response.status}`);
		}

		// 处理 SSE 流式响应
		if (!response.body) {
			throw new Error("响应体为空");
		}

		const reader = response.body.getReader();
		const decoder = new TextDecoder();
		let buffer = "";
		let content = "";

		while (true) {
			const { done, value } = await reader.read();

			if (done) {
				break;
			}

			// 将接收到的数据块解码并添加到缓冲区
			buffer += decoder.decode(value, { stream: true });

			// 处理缓冲区中的完整行
			const lines = buffer.split("\n");
			buffer = lines.pop() || ""; // 保留最后一个不完整的行

			for (const line of lines) {
				const trimmedLine = line.trim();

				// 跳过空行和注释
				if (!trimmedLine || trimmedLine.startsWith(":")) {
					continue;
				}

				// 处理 data: 开头的行
				if (trimmedLine.startsWith("data: ")) {
					const data = trimmedLine.slice(6); // 移除 "data: " 前缀

					// 尝试解析 JSON 数据
					try {
						const jsonData = JSON.parse(data);
						// 只处理 answer 类型的数据
						if (jsonData.type === "answer" && jsonData.content) {
							content = jsonData.content;
						}
					} catch (_e) {
						// 如果不是 JSON，忽略
					}
				} else if (trimmedLine === "[DONE]") {
					// SSE 流结束标记
					break;
				}
			}
		}

		// 处理缓冲区中剩余的数据
		if (buffer.trim()) {
			const trimmedLine = buffer.trim();
			if (trimmedLine.startsWith("data: ")) {
				const data = trimmedLine.slice(6);
				try {
					const jsonData = JSON.parse(data);
					// 只处理 answer 类型的数据
					if (jsonData.type === "answer" && jsonData.content) {
						content = jsonData.content;
					}
				} catch (_e) {
					// 如果不是 JSON，忽略
				}
			}
		}

		return content;
	} catch (error) {
		console.error("请求异常：", error);
		throw error;
	}
};

// 示例使用
const ask = async (filePath: string) => {
	return await fetchSSEAnswer("http://0.0.0.0:8001/sse/chat", {
		query: fs.readFileSync(filePath, "utf-8"),
	});
};

export { ask };

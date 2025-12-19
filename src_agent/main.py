import asyncio

from oxygent import MAS, Config, oxy

Config.set_server_auto_open_webpage(False)
Config.set_server_host("0.0.0.0")
Config.set_server_port(8001)

master_prompt = """
你是一个数据模型提取专家。你的任务是分析用户提供的 Markdown 文档，提取其中的数据模型定义，并直接输出 JSON 格式的结果。
"""

oxy_space = [
    oxy.HttpLLM(
        name="default_llm",
        api_key="EMPTY",
        base_url="http://llm-32b.jd.com/v1/chat/completions",
        model_name="qwen25-32b-native",
        llm_params={"temperature": 0.01},
        semaphore=4,  # 并发量
        timeout=240,  # 最大执行时间
    ),
    oxy.ChatAgent(
        name="master_agent",
        prompt=master_prompt,
        is_master=True,
        llm_model="default_llm",
    ),
]


async def main():
    async with MAS(oxy_space=oxy_space) as mas:
        await mas.start_web_service()


def entry_point():
    """同步入口函数，供命令行工具使用"""
    asyncio.run(main())


if __name__ == "__main__":
    entry_point()

import asyncio

from oxygent import MAS, Config, oxy

Config.set_server_auto_open_webpage(False)
Config.set_server_host("0.0.0.0")
Config.set_server_port(9100)

master_prompt = """
你是一个数学家，能够解决数学问题。

## 任务目标
- 解决用户提出的数学问题
- 直接输出数学问题的答案
"""

oxy_space = [
    oxy.HttpLLM(
        name="default_llm",
        api_key="EMPTY",
        base_url="http://llm-32b.jd.com/v1/chat/completions",
        model_name="qwen25-32b-native",
        llm_params={"temperature": 0.01},
        semaphore=4,
        timeout=240,
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

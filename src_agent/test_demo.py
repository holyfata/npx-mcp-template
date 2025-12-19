import pytest


# 参数化：(输入1, 输入2, 预期结果)
@pytest.mark.parametrize(
    "a, b, expected", [(1, 2, 3), (0, 0, 0), (-1, 1, 0), (10, -5, 5)]
)
def test_add_parametrize(a, b, expected):
    assert a + b == expected

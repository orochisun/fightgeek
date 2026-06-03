"""兼容: python -m api  等价于 python3 ../main.py"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from main import main

if __name__ == "__main__":
    raise SystemExit(main())

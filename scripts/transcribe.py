import sys
import whisper
from whisper.utils import get_writer

# Check if a filename argument is provided
if len(sys.argv) < 2:
    print("Usage: python script.py <filename>")
    sys.exit(1)

# The first command-line argument is the filename
filename = sys.argv[1]

model = whisper.load_model("base")
audio = whisper.load_audio(filename)
result = model.transcribe(audio)

json_writer = get_writer("json", ".")
json_writer(result, "./bestTr.json", {"max_line_width":50, "max_line_count":2, "highlight_words":False})

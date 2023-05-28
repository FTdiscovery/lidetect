import openai 
import logging
import os 
import time
import numpy as np
import random

# TODO: You need to feed in your API key.
def init_openai():

    openai.api_base = 'https://ovalopenairesource.openai.azure.com/'
    openai.api_type = 'azure'
    openai.api_version = '2022-12-01' # this may change in the future
    openai.api_key = os.getenv('OPENAI_API_KEY')

MAX_ATTEMPTS = 5

def call_openai(prompt, log=False): 

    init_openai()
    max_tokens = min(1024, max(1, 3800 - int(len(prompt) / 4)))
    sleep = 1.0
    for i in range(MAX_ATTEMPTS):
        try:
            response = openai.Completion.create(engine="text-davinci-003", prompt=prompt, max_tokens=max_tokens, temperature=0)
            text = response['choices'][0]['text'].replace('\n', '').replace(' .', '.').strip()
            return text
            break
        except Exception as e:
            if i != MAX_ATTEMPTS-1:
                if "reduce your prompt" in str(e): # if our prompt is too long
                    idx = str(e).index('(')
                    max_tokens = 4096 - int(str(e)[idx+1:idx+5].strip())
                    if int(str(e)[idx+1:idx+5].strip()) > 4096:
                        logging.warning("Prompt was longer than 4096 tokens.")
                    else:      
                        logging.warning(f"Encountered token length issue; reducing token count to {str(max_tokens)}")
                logging.warning(f"{e}")
                logging.warning(f"Timeout, sleeping for {3**i}s, then trying again ({i+1}/{MAX_ATTEMPTS})")
                time.sleep(3**i)

    logging.warning("We had encountered an error, output is null")
    return None # we encountered an error somewhere

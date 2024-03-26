import os

# The root directory you want to start from
root_dir = os.getcwd()
output_file = 'main_content.txt'

# Open the output file outside of the loop to avoid reopening it many times
with open(output_file, 'w', encoding='utf-8', errors='replace') as outfile:
    # os.walk generates the file names in a directory tree by walking the tree either top-down or bottom-up
    for subdir, dirs, files in os.walk(root_dir):
        for file in files:
            if 'age-lock' in file:
                continue
            if 'node_modules' in subdir:
                continue
            if 'bundle.js.map' in subdir:
                print(subdir)
                continue
            if '.sqlite' in subdir:
                
                continue

            # Get the full path of the file
            file_path = os.path.join(subdir, file)
            # Write the file path to the output file
            outfile.write(f'File path: {file_path}\n')
            
            # Open and read the content of the file
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as infile:
                content = infile.read()
                outfile.write(content + '\n\n')

print(f'All file paths and contents have been written to {output_file}.')

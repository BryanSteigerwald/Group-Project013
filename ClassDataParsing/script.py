import csv

def format_csv(input_file, output_file):
    data = []
    with open(input_file, 'r', encoding='utf-8') as file:
        current_entry = ['','', '', '']
        for line in file:
            line = line.strip()
            if line:
                print(line)
                if line.startswith("CSCI"):
                    current_entry[0] = current_entry[1][:9]
                    current_entry[3] = current_entry[3].strip()
                    data.append(current_entry)
                    current_entry = ['', '', '','']
                if current_entry[1] == '':
                    current_entry[1] = line
                elif current_entry[2] == '':
                    current_entry[2] = line
                else:
                    current_entry[3]+=line+"\n"

    with open(output_file, 'w', newline='', encoding='utf-8') as csvfile:
        csv_writer = csv.writer(csvfile, quoting=csv.QUOTE_ALL)
        csv_writer.writerow(['class_id','name', 'description', 'info'])
        csv_writer.writerows(data)


def generate_sql_inserts(csv_file, sql_file, table_name):
    with open(csv_file, 'r', encoding='utf-8') as file:
        csv_reader = csv.reader(file)
        next(csv_reader)  # Skip header
        with open(sql_file, 'w') as sqlfile:
            for row in csv_reader:
                values = ', '.join([f'"{value}"' for value in row])
                sqlfile.write(f'INSERT INTO {table_name} (class_id, name, description, info) VALUES ({values});\n')

input_file = 'input.txt'  
output_file = 'output.csv' 
sql_file = 'insert.sql' 
table_name = 'classes'  
format_csv(input_file, output_file)
generate_sql_inserts(output_file, sql_file, table_name)
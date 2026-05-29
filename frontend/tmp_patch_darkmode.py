from pathlib import Path
p = Path('src/pages/users/policypage.jsx')
t = p.read_text(encoding='utf-8')
if 'const bgColor = useColorModeValue("white", "gray.900");' not in t:
    raise SystemExit('root line not found')
t = t.replace('const bgColor = useColorModeValue("white", "gray.900");', 'const bgColor = useColorModeValue("white", "gray.900");\n  const textColor = useColorModeValue("gray.800", "white");\n  const headingColor = useColorModeValue("gray.900", "white");\n  const subTextColor = useColorModeValue("gray.700", "white");')
t = t.replace('color="gray.900"', 'color={headingColor}')
t = t.replace('color="gray.800"', 'color={textColor}')
t = t.replace('color="gray.700"', 'color={subTextColor}')
p.write_text(t, encoding='utf-8')
print('updated patch')

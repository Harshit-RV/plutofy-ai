import parse from 'json-templates';

const parseTemplate = (originalTemplate: string, data: object) => {
  const template = parse(originalTemplate);
  return template(data);
}

export default parseTemplate;
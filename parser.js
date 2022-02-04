const fnJoin = (expression) => {
    const [delimiter, values] = expression;
    return values.join(delimiter, resolveExpressions(values))
}

const fnGetAtt = (expression) => {
    return expression.join('', expression)
}

const resolveExpressions = (expressions) => {
    const intrinsicFunctions = [
        {
            templateName: 'Ref', resolver: () => 'aws'
        },
        {
            templateName: 'Fn::GetAtt', resolver: fnGetAtt
        },
        {
            templateName: 'Fn::Join', resolver: fnJoin
        }
    ]
    return expressions.map((item, key) => {
        intrinsicFunctions.map((func) => {
            if (item.hasOwnProperty(func.templateName)) {
                expressions[key] = func.resolver(item[func.templateName]);
            }
        })
        return expressions[key]
    })
}

module.exports = {
    fnJoin,
    resolveExpressions
}
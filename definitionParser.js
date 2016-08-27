"use strict";
var ts = require('typescript');
var fs = require('fs');
var path = require('path');
var util = require('./util.js');

function printChildTypes(root) {
    ts.forEachChild(root, function (n) {
        return console.log(n.kind + ' ' + ts.SyntaxKind[n.kind]);
    });
}
function getKind(isKind, roots) {
    var result = [];
    roots.forEach(function (root) {
        if (isKind(root.kind))
            result.push(root);
        ts.forEachChild(root, function (node) {
            if (isKind(node.kind))
                result.push(node);
        });
    });
    return result;
}
function hasKind(isKind, roots) {
    var result = false;
    roots.forEach(function (root) {
        ts.forEachChild(root, function (node) {
            if (isKind(node.kind)) {
                result = true;
                return;
            }
        });
    });
    return result;
}
function getKindRecurse(isKind, roots) {
    var result = [];
    roots.forEach(function (root) {
        return aggregate(root);
    });
    return result;
    function aggregate(node) {
        if (isKind(node.kind)) {
            result.push(node);
        }
        ts.forEachChild(node, aggregate);
    }
}
function isClassInterfaceRecursively(kind) {
    return kind === ts.SyntaxKind.InterfaceDeclaration || kind === ts.SyntaxKind.ClassDeclaration;
}
function isKindNamespaceDeclaration(kind) {
    return kind === ts.SyntaxKind.NamespaceImport;
}
function isClassDeclaration(kind) {
    return kind === ts.SyntaxKind.ClassDeclaration;
}
function isKindModuleDeclaration(kind) {
    return kind === ts.SyntaxKind.ModuleDeclaration;
}
function isKindModuleBlock(kind) {
    return kind === ts.SyntaxKind.ModuleBlock;
}
function isKindInterfaceDeclaration(kind) {
    return kind === ts.SyntaxKind.InterfaceDeclaration;
}
function isKindEnumDeclaration(kind) {
    return kind === ts.SyntaxKind.EnumDeclaration;
}
function isKindEnumMember(kind) {
    return kind === ts.SyntaxKind.EnumMember;
}
function isKindFunctionDeclaration(kind) {
    return kind === ts.SyntaxKind.FunctionDeclaration || kind === ts.SyntaxKind.MethodDeclaration || kind === ts.SyntaxKind.MethodSignature;
}
function isKindExportAssignment(kind) {
    return kind === ts.SyntaxKind.ExportAssignment;
}
function isKindIdentifier(kind) {
    return kind === ts.SyntaxKind.Identifier;
}
function isKindLiteralToken(kind) {
    return ts.SyntaxKind.FirstLiteralToken <= kind && kind <= ts.SyntaxKind.LastLiteralToken;
}
function isKindHeritageClause(kind) {
    return kind === ts.SyntaxKind.HeritageClause;
}
function isKindPropertyDeclaration(kind) {
    return kind === ts.SyntaxKind.PropertyDeclaration;
}
function isKindPropertySignature(kind) {
    return kind === ts.SyntaxKind.PropertySignature;
}
function isKindTypeReference(kind) {
    return kind === ts.SyntaxKind.TypeReference;
}
function isKindExpressionWithTypeArguments(kind) {
    return kind === ts.SyntaxKind.ExpressionWithTypeArguments;
}
function isKindQuestionToken(kind) {
    return kind === ts.SyntaxKind.QuestionToken;
}
function isKindTypeParameter(kind) {
    return kind === ts.SyntaxKind.TypeParameter;
}
function isKindVariableStatement(kind) {
    return kind === ts.SyntaxKind.VariableStatement;
}
function isKindVariableDeclarationList(kind) {
    return kind === ts.SyntaxKind.VariableDeclarationList;
}
function isKindVariableDeclaration(kind) {
    return kind === ts.SyntaxKind.VariableDeclaration;
}
function isKindKeyword(kind) {
    return ts.SyntaxKind.FirstKeyword <= kind && kind <= ts.SyntaxKind.LastKeyword;
}
function isKindParameter(kind) {
    return kind === ts.SyntaxKind.Parameter;
}
function getClassInterfaceRecursively(roots) {
    return getKindRecurse(isClassInterfaceRecursively, roots);
}
function getNamespaceDeclarations(roots) {
    return getKind(isKindNamespaceDeclaration, roots);
}
function getClassDeclarations(roots) {
    return getKind(isClassDeclaration, roots);
}
function getModulesDeclarations(roots) {
    return getKind(isKindModuleDeclaration, roots);
}
function getModuleBlocks(roots) {
    return getKind(isKindModuleBlock, roots);
}
function getInterfaceDeclarations(roots) {
    return getKind(isKindInterfaceDeclaration, roots);
}
function getInterfaceDeclarationsRecurse(roots) {
    return getKindRecurse(isKindInterfaceDeclaration, roots);
}
function getEnumDeclarations(roots) {
    return getKind(isKindEnumDeclaration, roots);
}
function getEnumMembers(roots) {
    return getKind(isKindEnumMember, roots);
}
function getFunctionDeclarations(roots) {
    return getKind(isKindFunctionDeclaration, roots);
}
function getExportAssigments(roots) {
    return getKind(isKindExportAssignment, roots);
}
function getLiteralTokens(roots) {
    return getKind(isKindLiteralToken, roots);
}
function getHeritageClauses(roots) {
    return getKind(isKindHeritageClause, roots);
}
function getExpressionWithTypeArguments(roots) {
    return getKind(isKindExpressionWithTypeArguments, roots);
}
function getTypeReferences(roots) {
    return getKind(isKindTypeReference, roots);
}
function getIdentifiers(roots) {
    return getKind(isKindIdentifier, roots);
}
function getTypeParameters(roots) {
    return getKind(isKindTypeParameter, roots);
}
function getVariableStatements(roots) {
    return getKind(isKindVariableStatement, roots);
}
function getVariableDeclarationLists(roots) {
    return getKind(isKindVariableDeclarationList, roots);
}
function getVariableDeclarations(roots) {
    return getKind(isKindVariableDeclaration, roots);
}
function getKeywords(roots) {
    return getKind(isKindKeyword, roots);
}
function getParameters(roots) {
    return getKind(isKindParameter, roots);
}
function getPropertyDeclarations(roots) {
    return getKind(isKindPropertyDeclaration, roots);
}
// TODO ts.PropertySignature exposed in newer version
// https://github.com/Microsoft/TypeScript/blob/master/src/compiler/types.ts#L590
function getPropertySignatures(roots) {
    return getKind(isKindPropertySignature, roots);
}
function hasQuestionToken(roots) {
    return hasKind(isKindQuestionToken, roots);
}
// type guards
function isIdentifier(node) {
    return isKindIdentifier(node.kind);
}
function isLiteralToken(node) {
    return isKindLiteralToken(node.kind);
}
function isHeritageClause(node) {
    return isKindHeritageClause(node.kind);
}
function isPropertySignature(node) {
    return isKindPropertySignature(node.kind);
}
function isTypeReference(node) {
    return isKindTypeReference(node.kind);
}
function isExpressionWithTypeArguments(node) {
    return isKindExpressionWithTypeArguments(node.kind);
}
function isVariableStatement(node) {
    return isKindVariableStatement(node.kind);
}
function isVariableDeclaration(node) {
    return isKindVariableDeclaration(node.kind);
}
function isVariableDeclarationList(node) {
    return isKindVariableDeclarationList(node.kind);
}
function isKeyword(node) {
    return isKindKeyword(node.kind);
}
function isParameter(node) {
    return isKindParameter(node.kind);
}


function extractFunctions(mbs, currentResult, indent) {
    indent = indent || ' ';
    currentResult = currentResult || {
            arguments: {
                boolean: 0,
                string: 0,
                number: 0,
                any: 0,
                array: 0,
                class: 0,
                complex: 0,
                totalSimple: 0,
                totalAvailable: 0,
                totalComplex: 0
            },
            variables: {
                boolean: 0, string: 0, number: 0, any: 0, array: 0, class: 0, complex: 0
            }
        };
    var fds = getFunctionDeclarations(mbs);
    fds.map(function (fd) {
        if (fd.name !== undefined) {
            if (PRINT_DEBUG || PRINT_METHODS) process.stdout.write(indent + fd.name.text);
            printReturnType(fd, '  returns ');
            var pds = getParameters([fd]);
            pds.forEach(function (pd) {
                printText(pd.name, '  parameter ');
                var parameterType = printReturnType(pd, '    ');
                if (PRINT_DEBUG || PRINT_METHODS) process.stdout.write(' - ' + parameterType);
                if (parameterType.startsWith('array') && parameterType.includes('-')) {
                    currentResult.arguments.array += 1;
                    parameterType = parameterType.split('-')[1];
                }
                if (parameterType.includes('-')) {
                    parameterType = parameterType.split('-')[1];
                }
                var totalSimple = 0;
                switch (parameterType) {
                    case 'boolean':
                        currentResult.arguments.boolean += 1;
                        break;
                    case 'string':
                        currentResult.arguments.string += 1;
                        break;
                    case 'number':
                        currentResult.arguments.number += 1;
                        break;
                    case 'any':
                        currentResult.arguments.any += 1;
                        break;
                    case 'array':
                        currentResult.arguments.array += 1;
                        totalSimple = 1;
                        break;
                    case 'union_basic':
                        break;
                    case 'complex':
                        currentResult.arguments.complex += 1;
                        totalSimple = 1;
                        break;
                    default:
                        currentResult.arguments.class += 1;
                        totalSimple = 2;
                }
                if (totalSimple === 0) {
                    currentResult.arguments.totalSimple += 1;
                } else if (totalSimple === 1) {
                    currentResult.arguments.totalComplex += 1;
                } else {
                    currentResult.arguments.totalAvailable += 1;
                }
            });
            if (PRINT_DEBUG || PRINT_METHODS) process.stdout.write('\n');
        }
    });
    return currentResult;
}

var currentResults = {
    arguments: {
        boolean: 0,
        string: 0,
        number: 0,
        any: 0,
        array: 0,
        class: 0,
        complex: 0,
        totalSimple: 0,
        totalAvailable: 0,
        totalComplex: 0
    },
    variables: {
        boolean: 0, string: 0, number: 0, any: 0, array: 0, class: 0, complex: 0
    }
};

var processedProjects = 0;
function getProperNode(cn, mbs, exportVariables, vd, sf) {
    var currentNode = cn;
    for (var i = 0; i < exportVariables.length; i++) {
        if (exportVariables[i] !== undefined) {
            var currentVar = exportVariables[i].split('.');
            for (var j = 0; j < currentVar.length; j++) {
                if (j === 0) {
                    currentNode = detectExportedModule(currentVar[j], mbs, vd, sf);
                } else {
                    if (currentNode !== undefined) {
                        currentNode = detectExportedModule(currentVar[j], [currentNode]);
                    }
                }
            }
        }
    }
    return currentNode;
}
function processFile(project, filename) {
    var result = {};
    try {
        console.log('File >>> ' + filename);

        var source = String(fs.readFileSync(filename));
        var sf = ts.createSourceFile(filename, source, ts.ScriptTarget.Latest);

        var mds = getModulesDeclarations([sf]);
        var vd = getVariableStatements([sf]);

        var mbs = getModuleBlocks(mds);
        var ea = getExportAssigments(mbs);

        var exportVariables = [];
        var exportVariablesMap = {};

        var validModules = [];

        var totalClassInterface = getClassInterfaceRecursively([sf]);

        //PropertySignature = 144,
        //CallSignature = 151,
        //MethodSignature = 146,
        var definedClasses = {};
        for (var i = 0; i < totalClassInterface.length; i++) {
            var curClass = totalClassInterface[i];
            var propSig = getPropertySignatures([curClass]);
            var definedProperties = {};
            for (var j = 0; j < propSig.length; j++) {
                var curProp = propSig[j];
                var propvalues = {};
                propvalues['optional'] = curProp.questionToken !== undefined;
                propvalues['type'] = getTypeForProperty(source, curProp);
                definedProperties[curProp.name.text] = propvalues;
            }
            definedClasses[curClass.name.text] = definedProperties
        }

        ea.map(function (dd) {
            if(dd.expression.text===undefined) {
                console.log();
            }
            exportVariables.push(dd.expression.text);
        });
        if (exportVariables.length === 0) {
            var vs = getVariableStatements([sf]);
            vs.map(function (dd) {
                var varDeclared = dd.declarationList.declarations[0].type;
                if(source.substring(ts.skipTrivia(source, varDeclared.pos), varDeclared.end)===undefined) {
                    console.log();
                }
                exportVariables.push(source.substring(ts.skipTrivia(source, varDeclared.pos), varDeclared.end));
            });
        }
        var currentNode = getProperNode(mbs, mbs, exportVariables, vd, sf);

        while (currentNode.kind === ts.SyntaxKind.VariableDeclaration) {
            var varDeclared = currentNode.type;
            exportVariables = [];
            if(source.substring(ts.skipTrivia(source, varDeclared.pos), varDeclared.end)===undefined) {
                console.log();
            }
            exportVariables.push(source.substring(ts.skipTrivia(source, varDeclared.pos), varDeclared.end));
            currentNode = getProperNode([currentNode], mbs, exportVariables, vd, sf);
        }

        if (currentNode.kind === ts.SyntaxKind.ModuleDeclaration)
            extractFunctions(getModuleBlocks([currentNode]), currentResults);
        else
            extractFunctions([currentNode], currentResults);

        processedProjects++;
        //console.log(exportVariablesMap);

        /**
         var subMds = getModulesDeclarations(mbs);
         subMds.map(function (md) {
            return md.name.text;
        }).sort().forEach(function (nm) {
            if (PRINT_DEBUG) return console.log(nm);
        });
         if (PRINT_DEBUG) console.log('\n# Functions');
         //        extractFunctions(mbs, currentResult, '');

         if (PRINT_DEBUG) console.log('\n# Enums');
         var eds = getEnumDeclarations(mbs);
         eds.map(function (ed) {
            if (PRINT_DEBUG) console.log(ed.name.text);
            var ems = getEnumMembers([ed]);
            ems.forEach(function (em) {
                printText(em.name, '  ');
                var lts = getLiteralTokens([em]);
                lts.forEach(function (lt) {
                    return printText(lt, '    = ');
                });
            });
        });
         if (PRINT_DEBUG) console.log('\n# Interfaces');
         var ifds = getInterfaceDeclarations(mbs);
         ifds.map(function (ifd) {
            if (PRINT_DEBUG || PRINT_METHODS) console.log(ifd.name.text);
            extractFunctions([ifd], currentResult, '     ');
            var tps = getTypeParameters([ifd]);
            tps.forEach(function (tp) {
                if (PRINT_DEBUG) console.log('  of ' + tp.name.text);
            });
            var hcs = getHeritageClauses([ifd]);
            var ewtas = getExpressionWithTypeArguments(hcs);
            ewtas.forEach(function (ewta) {
                printIdentifiers([ewta], '  ');
                printTypeReferences([ewta], '    ');
            });
            var pss = getPropertySignatures([ifd]);
            pss.forEach(function (ps) {
                printText(ps.name, '  prop: ');
                printType(ps, '    ');
            });
        });

         if (PRINT_DEBUG) console.log('\n# Variables');
         var vbs = getVariableStatements(mbs);
         var vdls = getVariableDeclarationLists(vbs);
         var vds = getVariableDeclarations(vdls);
         vds.map(function (vd) {
            printIdentifiers([vd], '');
            var keyTypes = printType(vd, '  ');
            for (var i = 0; i < keyTypes.length; i++) {
                switch (keyTypes[i]) {
                    case 'boolean':
                        currentResult.variables.boolean += 1;
                        break;
                    case 'string':
                        currentResult.variables.string += 1;
                        break;
                    case 'number':
                        currentResult.variables.number += 1;
                        break;
                    case 'any':
                        currentResult.variables.any += 1;
                        break;
                    case 'array':
                        currentResult.variables.array += 1;
                        break;
                    default:
                        currentResult.variables.complex += 1;
                        break;
                }
            }
        });
         if (WRITE_FILE) {
            fs.appendFile('message.txt', JSON.stringify(currentResult) + ',', function (err) {

            });
        }
         */

        /*if(currentResult.arguments.totalSimple>5) {
         console.log(currentResult);
         }*/
        //printChildTypes(sf);
    } catch (err) {
        console.log('Unable to process : ' + filename);
    }
}

function detectExportedModule(currentVar, mbs, vd, sf) {
    var suitableModule;

    if (vd !== undefined) {
        vd.map(function (svd) {
            svd.declarationList.declarations.forEach(function (vd) {
                var variableName = vd.name.text;
                if (currentVar === variableName) {
                    suitableModule = vd;
                }
            })
        });
    }

    if (suitableModule === undefined) {
        getVariableStatements(mbs).map(function (svd) {
            svd.declarationList.declarations.forEach(function (vd) {
                var variableName = vd.name.text;
                if (currentVar === variableName) {
                    suitableModule = vd;
                }
            })
        });
    }

    if (suitableModule === undefined) {
        getFunctionDeclarations(mbs).map(function (sfd) {
            var variableName = sfd.name.text;
            if (currentVar === variableName) {
                suitableModule = sfd;
            }
        });
    }

    if (suitableModule === undefined) {
        getInterfaceDeclarations(mbs).map(function (sfd) {
            var variableName = sfd.name.text;
            if (currentVar === variableName) {
                suitableModule = sfd;
            }
        });
    }

    if (suitableModule === undefined) {
        getNamespaceDeclarations(mbs).map(function (sfd) {
            var variableName = sfd.name.text;
            if (currentVar === variableName) {
                suitableModule = sfd;
            }
        });
    }

    if (suitableModule === undefined) {
        getClassDeclarations(mbs).map(function (sfd) {
            var variableName = sfd.name.text;
            if (currentVar === variableName) {
                suitableModule = sfd;
            }
        });
    }

    if (sf !== undefined && suitableModule === undefined) {
        getModulesDeclarations([sf]).map(function (sfd) {
            var variableName = sfd.name.text;
            if (currentVar === variableName) {
                if (suitableModule === undefined)
                    suitableModule = sfd;
                else if (suitableModule.body.statements.length < sfd.body.statements.length) {
                    suitableModule = sfd;
                }
            }
        });
    }

    if (sf !== undefined && suitableModule === undefined) {
        getInterfaceDeclarations([sf]).map(function (sfd) {
            var variableName = sfd.name.text;
            if (currentVar === variableName) {
                if (suitableModule === undefined)
                    suitableModule = sfd;
                else if (suitableModule.members.length < sfd.members.length) {
                    suitableModule = sfd;
                }
            }
        });
    }
    return suitableModule;
}

function getTypeForProperty(source, node) {
    var results = {object: false, array: false, function: false, properties: {}}
    var prop;
    if (node.type.kind === ts.SyntaxKind.FunctionType) {
        //Function type. Complex so just mark as function and skip
        prop = 'function';
        results.function = true;
    } else {
        var tokenValue = ts.tokenToString(node.type.kind);
        if (tokenValue === undefined) {
            //token value undefined so complex type. Further analyse
            if (node.type.members !== undefined) {
                //TODO: if object recursively call this method
                results.object = true;
                prop = {};
                var members = node.type.members;
                for (var i = 0; i < members.length; i++) {
                    prop[members[i].name.text] = getTypeForProperty(source, members[i]);
                }
            } else {
                var eleType = node.type;
                if (node.type.kind === ts.SyntaxKind.ArrayType) {
                    //Array type detected
                    results.array = true;
                    eleType = node.type.elementType;
                }
                var typeName = eleType.typeName;

                if (typeName === undefined) {
                    //If type name is undefined then it should be multiple types (ex obj1 | obj2)
                    var types = eleType.types;
                    if (results.object) types = eleType;
                    if (types === undefined) {
                        //TODO Remove
                        console.log();
                    }
                    prop = [];
                    if (types === undefined) {
                        console.log();
                    }
                    for (var i = 0; i < types.length; i++) {
                        //Multiple types. Loop every one
                        var curType = types[i];
                        tokenValue = ts.tokenToString(curType.kind);
                        if (tokenValue === undefined) {
                            typeName = curType.typeName;
                            if (typeName === undefined) {
                                //TODO Remove
                                console.log();
                            }
                            var tmp = source.substring(ts.skipTrivia(source, typeName.pos), typeName.end);
                            //Currently not focusing on fully qualified name and assuming last part of the name is enough
                            if (tmp === undefined) {
                                console.log();
                            }
                            tmp = tmp.split(".");
                            tmp = tmp[tmp.length - 1];
                            prop.push(tmp);
                        } else {
                            //Simple type.
                            prop.push(tokenValue);
                        }
                    }
                } else {
                    prop = source.substring(ts.skipTrivia(source, typeName.pos), typeName.end);
                    if (prop === undefined) {
                        console.log();
                    }
                    prop = prop.split(".");
                    prop = prop[prop.length - 1];
                }
            }
        } else {
            //Simple type
            prop = tokenValue;
        }
        results.properties = prop;
        return results;
    }
}

exports.main = main;

function printText(node, indent) {
    if (isIdentifier(node))
        if (PRINT_DEBUG) console.log(indent + node.text);
        else if (isLiteralToken(node))
            if (PRINT_DEBUG) console.log(indent + node.text);
            else if (PRINT_DEBUG) console.log(indent + 'name kind ' + node.kind);
}
function printType(node, indent) {
    printTypeReferences([node], indent);
    var keywords = printKeywords([node], indent); // if simple types like string, bool
    if (hasQuestionToken([node]))
        if (PRINT_DEBUG) console.log(indent + '?');
    return keywords;
}
function printIdentifiers(nodes, indent) {
    var ids = getIdentifiers(nodes);
    ids.forEach(function (id) {
        if (PRINT_DEBUG) return console.log(indent + id.text);
    });
}
function printTypeReferences(nodes, indent) {
    var trs = getTypeReferences(nodes);
    trs.forEach(function (tr) {
        return printIdentifiers(trs, indent);
    });
}
function printKeywords(nodes, indent) {
    var resultList = [];
    var kws = getKeywords(nodes);
    kws.forEach(function (kw) {
        switch (kw.kind) {
            case ts.SyntaxKind.AnyKeyword:
                if (PRINT_DEBUG) console.log(indent + 'any_type');
                resultList.push('any');
                break;
            case ts.SyntaxKind.BooleanKeyword:
                if (PRINT_DEBUG) console.log(indent + 'boolean');
                resultList.push('boolean');
                break;
            case ts.SyntaxKind.StringKeyword:
                if (PRINT_DEBUG) console.log(indent + 'string');
                resultList.push('string');
                break;
            case ts.SyntaxKind.NumberKeyword:
                if (PRINT_DEBUG) console.log(indent + 'number');
                resultList.push('number');
                break;
            case ts.SyntaxKind.ArrayType:
                if (PRINT_DEBUG) console.log(indent + 'array');
                resultList.push('array');
                break;
            default:
                if (PRINT_DEBUG) console.log(indent + ts.SyntaxKind[kw.kind]);
                resultList.push('complex');
        }
    });
    return resultList;
}

function printReturnType(node, indent) {
    var tr = node;
    if (tr.type === undefined) {
        if (PRINT_DEBUG) console.log(indent + 'any');
        return 'any';
    }
    var currentNode = tr.type;
    var returnType = '';
    var baseReturnType = '';
    var currentKind = tr.type.kind;
    if (ts.SyntaxKind.ArrayType == currentKind) {
        currentKind = tr.type.elementType.kind;
        currentNode = tr.type.elementType;
        returnType = 'array ';
        baseReturnType = 'array';
    }
    var switchReturnType = ' ';
    switch (currentKind) {
        case ts.SyntaxKind.TypeReference:
            switchReturnType = 'complex';
            if (currentNode.typeName.kind == ts.SyntaxKind.QualifiedName) {
                returnType += currentNode.typeName.left.text + '.' + currentNode.typeName.right.text;
                switchReturnType = currentNode.typeName.right.text;
            } else if (currentNode.typeName.kind == ts.SyntaxKind.Identifier) {
                returnType += currentNode.typeName.text;
                switchReturnType = currentNode.typeName.text;
            } else {
                if (PRINT_DEBUG)  console.log();
            }
            break;
        case ts.SyntaxKind.ArrayType:
            returnType += 'array';
            switchReturnType = 'array';
            break;
        case ts.SyntaxKind.BooleanKeyword:
            returnType += 'boolean';
            switchReturnType = 'boolean';
            break;
        case ts.SyntaxKind.StringKeyword:
            returnType += 'string';
            switchReturnType = 'string';
            break;
        case ts.SyntaxKind.NumberKeyword:
            returnType += 'number';
            switchReturnType = 'number';
            break;
        case ts.SyntaxKind.AnyKeyword:
            returnType += 'any';
            switchReturnType = 'any';
            break;
        case ts.SyntaxKind.VoidKeyword:
            returnType += 'void';
            switchReturnType = 'void';
            break;
        case ts.SyntaxKind.UnionType:
            switchReturnType = 'union_basic';
            returnType += '{ ';
            currentNode.types.forEach(function (union) {
                if (union.kind == ts.SyntaxKind.StringKeyword)
                    returnType += 'string, ';
                else if (union.kind == ts.SyntaxKind.BooleanKeyword)
                    returnType += 'boolean, ';
                else if (union.kind == ts.SyntaxKind.NumberKeyword)
                    returnType += 'number, ';
                else if (union.kind == ts.SyntaxKind.AnyKeyword)
                    returnType += 'any, ';
                else {
                    returnType += 'complex, ';
                    switchReturnType = 'union_complex';
                }
            });
            returnType += '}';
            break;
        case ts.SyntaxKind.FunctionType:
            returnType += 'function';
            switchReturnType = 'complex';
            break;
        default:
            returnType += 'complex';
            switchReturnType = 'complex';
            break
    }
    baseReturnType += '-' + switchReturnType;
    if (PRINT_DEBUG) console.log(indent + ts.SyntaxKind[tr.type.kind] + ' : ' + returnType);
    return baseReturnType;
}

function main(ROOT, cb) {
    fs.readdir(ROOT, function (err, files) {
        if (err) throw err;
        files.forEach(function (file) {
            var filePath = path.resolve(ROOT, file);
            fs.stat(filePath, function (err, stats) {
//                if(file=='absolute' && !file.startsWith('.') && stats && stats.isDirectory()) {
                if (!file.startsWith('.') && stats && stats.isDirectory()) {
                    fs.exists(path.resolve(ROOT, file, file + '.d.ts'), function (exists) {
                        if (exists) {
                            processFile(file, ROOT + file + '/' + file + '.d.ts');
                        }
                    });
                }
            });
        });
        return results;
    });
}

function printResults(data) {
    //console.log(data);
}

var WRITE_FILE = false;
var PRINT_DEBUG = false;
var PRINT_METHODS = true;
var ROOT = '/Users/Pankajan/Edinburgh/Source/DefinitelyTyped/';

module.exports = {
    getFunctions: function (projectName, fileName) {
        return processFile(projectName, ROOT + projectName + '/' + fileName + '.d.ts');
    }
};
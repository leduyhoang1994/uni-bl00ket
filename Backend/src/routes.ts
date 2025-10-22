/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import type { TsoaRoute } from '@tsoa/runtime';
import {  fetchMiddlewares, ExpressTemplateService } from '@tsoa/runtime';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { ExternalController } from './controllers/external.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { CmsController } from './controllers/cms.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { InternalApiController } from './controllers/internal.controller';
import { expressAuthentication } from './authentication';
// @ts-ignore - no great way to install types from subpackage
import type { Request as ExRequest, Response as ExResponse, RequestHandler, Router } from 'express';
const multer = require('multer');


const expressAuthenticationRecasted = expressAuthentication as (req: ExRequest, securityName: string, scopes?: string[], res?: ExResponse) => Promise<any>;


// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
    "ResponseType__joinUrls-string-Array__": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"data":{"dataType":"nestedObjectLiteral","nestedProperties":{"joinUrls":{"dataType":"array","array":{"dataType":"string"},"required":true}},"required":true},"code":{"dataType":"double","required":true},"success":{"dataType":"boolean","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ECreateHostBody": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"hostCount":{"dataType":"double","required":true},"gameId":{"dataType":"string","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ECreateHostByIdsBody": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"hostIds":{"dataType":"array","array":{"dataType":"string"},"required":true},"gameId":{"dataType":"string","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ResponseType__hostIds-string-Array__": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"data":{"dataType":"nestedObjectLiteral","nestedProperties":{"hostIds":{"dataType":"array","array":{"dataType":"string"},"required":true}},"required":true},"code":{"dataType":"double","required":true},"success":{"dataType":"boolean","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Schedules": {
        "dataType": "refAlias",
        "type": {"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"array","array":{"dataType":"double"}}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "EHostIds": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"schedules":{"ref":"Schedules"},"hostIds":{"dataType":"array","array":{"dataType":"string"},"required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "HostState": {
        "dataType": "refEnum",
        "enums": ["lobby","in-game","ended"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GameMode": {
        "dataType": "refEnum",
        "enums": ["cafe","gold-quest"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "HostLeaderboardItem": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"meta":{"dataType":"string"},"avatar":{"dataType":"string"},"username":{"dataType":"string"},"score":{"dataType":"double","required":true},"playerId":{"dataType":"string","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ActivityBoardItem": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"activity":{"dataType":"any","required":true},"avatar":{"dataType":"string","required":true},"username":{"dataType":"string","required":true},"playerId":{"dataType":"string","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Question": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"correctAnswerId":{"dataType":"string","required":true},"answers":{"dataType":"array","array":{"dataType":"nestedObjectLiteral","nestedProperties":{"text":{"dataType":"string","required":true},"id":{"dataType":"string","required":true}}},"required":true},"text":{"dataType":"string","required":true},"id":{"dataType":"string","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_HostInfo.Exclude_keyofHostInfo.personalResult-or-userInfo__": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"hostId":{"dataType":"string"},"gameId":{"dataType":"string"},"gameSettings":{"dataType":"nestedObjectLiteral","nestedProperties":{},"additionalProperties":{"dataType":"any"}},"state":{"ref":"HostState"},"gameMode":{"ref":"GameMode","required":true},"finalStandings":{"dataType":"array","array":{"dataType":"refAlias","ref":"HostLeaderboardItem"}},"activitiesBoard":{"dataType":"array","array":{"dataType":"refAlias","ref":"ActivityBoardItem"}},"groupId":{"dataType":"string"},"questions":{"dataType":"array","array":{"dataType":"refAlias","ref":"Question"}},"startTime":{"dataType":"double"},"endTime":{"dataType":"double"}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Omit_HostInfo.personalResult-or-userInfo_": {
        "dataType": "refAlias",
        "type": {"ref":"Pick_HostInfo.Exclude_keyofHostInfo.personalResult-or-userInfo__","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "EHostInfo": {
        "dataType": "refAlias",
        "type": {"ref":"Omit_HostInfo.personalResult-or-userInfo_","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ResponseType__hostInfo-EHostInfo__": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"data":{"dataType":"nestedObjectLiteral","nestedProperties":{"hostInfo":{"ref":"EHostInfo","required":true}},"required":true},"code":{"dataType":"double","required":true},"success":{"dataType":"boolean","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_GetHostInfoOpts.Exclude_keyofGetHostInfoOpts.personalResult-or-userInfo__": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"activitiesBoard":{"dataType":"boolean"},"questions":{"dataType":"boolean"},"fullLeaderboard":{"dataType":"boolean"}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Omit_GetHostInfoOpts.personalResult-or-userInfo_": {
        "dataType": "refAlias",
        "type": {"ref":"Pick_GetHostInfoOpts.Exclude_keyofGetHostInfoOpts.personalResult-or-userInfo__","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "EGetHostInfo": {
        "dataType": "refAlias",
        "type": {"ref":"Omit_GetHostInfoOpts.personalResult-or-userInfo_","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Game": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"mode":{"ref":"GameMode","required":true},"name":{"dataType":"string","required":true},"_id":{"dataType":"string","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ResponseType__game-Game__": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"data":{"dataType":"nestedObjectLiteral","nestedProperties":{"game":{"ref":"Game","required":true}},"required":true},"code":{"dataType":"double","required":true},"success":{"dataType":"boolean","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ResponseType__game-Game--game_questions-Question-Array__": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"data":{"dataType":"nestedObjectLiteral","nestedProperties":{"game_questions":{"dataType":"array","array":{"dataType":"refAlias","ref":"Question"},"required":true},"game":{"ref":"Game","required":true}},"required":true},"code":{"dataType":"double","required":true},"success":{"dataType":"boolean","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ResponseType__list-Game-Array--total-number--page-number--limit-number--total_page-number__": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"data":{"dataType":"nestedObjectLiteral","nestedProperties":{"total_page":{"dataType":"double","required":true},"limit":{"dataType":"double","required":true},"page":{"dataType":"double","required":true},"total":{"dataType":"double","required":true},"list":{"dataType":"array","array":{"dataType":"refAlias","ref":"Game"},"required":true}},"required":true},"code":{"dataType":"double","required":true},"success":{"dataType":"boolean","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GameListOpts": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"limit":{"dataType":"integer","default":10},"page":{"dataType":"integer","default":1},"search":{"dataType":"string"}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CmsUser": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"email":{"dataType":"string"},"username":{"dataType":"string","required":true},"id":{"dataType":"string","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ResponseType__user-CmsUser--token-any__": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"data":{"dataType":"nestedObjectLiteral","nestedProperties":{"token":{"dataType":"any","required":true},"user":{"ref":"CmsUser","required":true}},"required":true},"code":{"dataType":"double","required":true},"success":{"dataType":"boolean","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ResponseType__hostId-string__": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"data":{"dataType":"nestedObjectLiteral","nestedProperties":{"hostId":{"dataType":"string","required":true}},"required":true},"code":{"dataType":"double","required":true},"success":{"dataType":"boolean","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PersonalResult": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"accuracy":{"dataType":"nestedObjectLiteral","nestedProperties":{"percent":{"dataType":"double","required":true},"total":{"dataType":"double","required":true},"corrects":{"dataType":"double","required":true}},"required":true},"rank":{"dataType":"double","required":true},"score":{"dataType":"double","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Player": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"score":{"dataType":"double"},"meta":{"dataType":"string"},"socketId":{"dataType":"string","required":true},"avatar":{"dataType":"string","required":true},"username":{"dataType":"string","required":true},"id":{"dataType":"string","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "HostInfo": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"endTime":{"dataType":"double"},"startTime":{"dataType":"double"},"questions":{"dataType":"array","array":{"dataType":"refAlias","ref":"Question"}},"groupId":{"dataType":"string"},"userInfo":{"ref":"Player"},"activitiesBoard":{"dataType":"array","array":{"dataType":"refAlias","ref":"ActivityBoardItem"}},"personalResult":{"ref":"PersonalResult"},"finalStandings":{"dataType":"array","array":{"dataType":"refAlias","ref":"HostLeaderboardItem"}},"gameMode":{"ref":"GameMode","required":true},"state":{"ref":"HostState"},"gameSettings":{"dataType":"nestedObjectLiteral","nestedProperties":{},"additionalProperties":{"dataType":"any"}},"gameId":{"dataType":"string"},"hostId":{"dataType":"string"}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateHostBody": {
        "dataType": "refObject",
        "properties": {
            "hostInfo": {"ref":"HostInfo","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ResponseType__hostInfo-HostInfo__": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"data":{"dataType":"nestedObjectLiteral","nestedProperties":{"hostInfo":{"ref":"HostInfo","required":true}},"required":true},"code":{"dataType":"double","required":true},"success":{"dataType":"boolean","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GetHostInfoOpts": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"questions":{"dataType":"boolean"},"userInfo":{"dataType":"boolean"},"activitiesBoard":{"dataType":"boolean"},"personalResult":{"dataType":"boolean"},"fullLeaderboard":{"dataType":"boolean"}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GetHostInfoBody": {
        "dataType": "refObject",
        "properties": {
            "hostId": {"dataType":"string","required":true},
            "options": {"ref":"GetHostInfoOpts"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ResponseType__token-string__": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"data":{"dataType":"nestedObjectLiteral","nestedProperties":{"token":{"dataType":"string","required":true}},"required":true},"code":{"dataType":"double","required":true},"success":{"dataType":"boolean","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GenTokenBody": {
        "dataType": "refObject",
        "properties": {
            "username": {"dataType":"string","required":true},
            "hostId": {"dataType":"string","required":true},
            "avatar": {"dataType":"string"},
            "meta": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ResponseType__gameData-any__": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"data":{"dataType":"nestedObjectLiteral","nestedProperties":{"gameData":{"dataType":"any","required":true}},"required":true},"code":{"dataType":"double","required":true},"success":{"dataType":"boolean","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ResponseType__players-Player-Array__": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"data":{"dataType":"nestedObjectLiteral","nestedProperties":{"players":{"dataType":"array","array":{"dataType":"refAlias","ref":"Player"},"required":true}},"required":true},"code":{"dataType":"double","required":true},"success":{"dataType":"boolean","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GetPlayersBody": {
        "dataType": "refObject",
        "properties": {
            "hostId": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const templateService = new ExpressTemplateService(models, {"noImplicitAdditionalProperties":"throw-on-extras","bodyCoercion":true});

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa




export function RegisterRoutes(app: Router,opts?:{multer?:ReturnType<typeof multer>}) {

    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################

    const upload = opts?.multer ||  multer({"limits":{"fileSize":8388608}});

    
        const argsExternalController_createHosts: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"ref":"ECreateHostBody"},
        };
        app.post('/external/host/create',
            authenticateMiddleware([{"apiKey":[]}]),
            ...(fetchMiddlewares<RequestHandler>(ExternalController)),
            ...(fetchMiddlewares<RequestHandler>(ExternalController.prototype.createHosts)),

            async function ExternalController_createHosts(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsExternalController_createHosts, request, response });

                const controller = new ExternalController();

              await templateService.apiHandler({
                methodName: 'createHosts',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsExternalController_createHostsByIds: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"ref":"ECreateHostByIdsBody"},
        };
        app.post('/external/host/create-by-ids',
            authenticateMiddleware([{"apiKey":[]}]),
            ...(fetchMiddlewares<RequestHandler>(ExternalController)),
            ...(fetchMiddlewares<RequestHandler>(ExternalController.prototype.createHostsByIds)),

            async function ExternalController_createHostsByIds(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsExternalController_createHostsByIds, request, response });

                const controller = new ExternalController();

              await templateService.apiHandler({
                methodName: 'createHostsByIds',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsExternalController_startHosts: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"ref":"EHostIds"},
        };
        app.post('/external/host/start',
            authenticateMiddleware([{"apiKey":[]}]),
            ...(fetchMiddlewares<RequestHandler>(ExternalController)),
            ...(fetchMiddlewares<RequestHandler>(ExternalController.prototype.startHosts)),

            async function ExternalController_startHosts(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsExternalController_startHosts, request, response });

                const controller = new ExternalController();

              await templateService.apiHandler({
                methodName: 'startHosts',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsExternalController_stopHosts: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"ref":"EHostIds"},
        };
        app.post('/external/host/end',
            authenticateMiddleware([{"apiKey":[]}]),
            ...(fetchMiddlewares<RequestHandler>(ExternalController)),
            ...(fetchMiddlewares<RequestHandler>(ExternalController.prototype.stopHosts)),

            async function ExternalController_stopHosts(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsExternalController_stopHosts, request, response });

                const controller = new ExternalController();

              await templateService.apiHandler({
                methodName: 'stopHosts',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsExternalController_getHostInfo: Record<string, TsoaRoute.ParameterSchema> = {
                hostId: {"in":"path","name":"hostId","required":true,"dataType":"string"},
                options: {"in":"body","name":"options","required":true,"ref":"EGetHostInfo"},
        };
        app.post('/external/host/info/:hostId',
            authenticateMiddleware([{"apiKey":[]}]),
            ...(fetchMiddlewares<RequestHandler>(ExternalController)),
            ...(fetchMiddlewares<RequestHandler>(ExternalController.prototype.getHostInfo)),

            async function ExternalController_getHostInfo(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsExternalController_getHostInfo, request, response });

                const controller = new ExternalController();

              await templateService.apiHandler({
                methodName: 'getHostInfo',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsCmsController_createGame: Record<string, TsoaRoute.ParameterSchema> = {
                game_questions: {"in":"formData","name":"game_questions","required":true,"dataType":"file"},
                game_name: {"in":"formData","name":"game_name","required":true,"dataType":"string"},
                game_mode: {"in":"formData","name":"game_mode","required":true,"dataType":"string"},
        };
        app.post('/cms/game',
            authenticateMiddleware([{"cmsBearerAuth":[]}]),
            upload.fields([
                {
                    name: "game_questions",
                    maxCount: 1
                }
            ]),
            ...(fetchMiddlewares<RequestHandler>(CmsController)),
            ...(fetchMiddlewares<RequestHandler>(CmsController.prototype.createGame)),

            async function CmsController_createGame(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCmsController_createGame, request, response });

                const controller = new CmsController();

              await templateService.apiHandler({
                methodName: 'createGame',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsCmsController_getGame: Record<string, TsoaRoute.ParameterSchema> = {
                game_id: {"in":"path","name":"game_id","required":true,"dataType":"string"},
        };
        app.get('/cms/game/:game_id',
            authenticateMiddleware([{"cmsBearerAuth":[]}]),
            ...(fetchMiddlewares<RequestHandler>(CmsController)),
            ...(fetchMiddlewares<RequestHandler>(CmsController.prototype.getGame)),

            async function CmsController_getGame(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCmsController_getGame, request, response });

                const controller = new CmsController();

              await templateService.apiHandler({
                methodName: 'getGame',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsCmsController_updateGame: Record<string, TsoaRoute.ParameterSchema> = {
                game_questions: {"in":"formData","name":"game_questions","required":true,"dataType":"file"},
                game_id: {"in":"formData","name":"game_id","required":true,"dataType":"string"},
                game_name: {"in":"formData","name":"game_name","required":true,"dataType":"string"},
                game_mode: {"in":"formData","name":"game_mode","required":true,"dataType":"string"},
        };
        app.post('/cms/game/update',
            authenticateMiddleware([{"cmsBearerAuth":[]}]),
            upload.fields([
                {
                    name: "game_questions",
                    maxCount: 1
                }
            ]),
            ...(fetchMiddlewares<RequestHandler>(CmsController)),
            ...(fetchMiddlewares<RequestHandler>(CmsController.prototype.updateGame)),

            async function CmsController_updateGame(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCmsController_updateGame, request, response });

                const controller = new CmsController();

              await templateService.apiHandler({
                methodName: 'updateGame',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsCmsController_listGame: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"ref":"GameListOpts"},
        };
        app.post('/cms/game/list',
            authenticateMiddleware([{"cmsBearerAuth":[]}]),
            ...(fetchMiddlewares<RequestHandler>(CmsController)),
            ...(fetchMiddlewares<RequestHandler>(CmsController.prototype.listGame)),

            async function CmsController_listGame(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCmsController_listGame, request, response });

                const controller = new CmsController();

              await templateService.apiHandler({
                methodName: 'listGame',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsCmsController_login: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"password":{"dataType":"string","required":true},"username":{"dataType":"string","required":true}}},
        };
        app.post('/cms/auth/login',
            ...(fetchMiddlewares<RequestHandler>(CmsController)),
            ...(fetchMiddlewares<RequestHandler>(CmsController.prototype.login)),

            async function CmsController_login(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCmsController_login, request, response });

                const controller = new CmsController();

              await templateService.apiHandler({
                methodName: 'login',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsInternalApiController_createHost: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"ref":"CreateHostBody"},
        };
        app.post('/host/create',
            ...(fetchMiddlewares<RequestHandler>(InternalApiController)),
            ...(fetchMiddlewares<RequestHandler>(InternalApiController.prototype.createHost)),

            async function InternalApiController_createHost(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsInternalApiController_createHost, request, response });

                const controller = new InternalApiController();

              await templateService.apiHandler({
                methodName: 'createHost',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsInternalApiController_getHostInfo: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                body: {"in":"body","name":"body","required":true,"ref":"GetHostInfoBody"},
        };
        app.post('/host/info',
            authenticateMiddleware([{"bearerAuth":[]}]),
            ...(fetchMiddlewares<RequestHandler>(InternalApiController)),
            ...(fetchMiddlewares<RequestHandler>(InternalApiController.prototype.getHostInfo)),

            async function InternalApiController_getHostInfo(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsInternalApiController_getHostInfo, request, response });

                const controller = new InternalApiController();

              await templateService.apiHandler({
                methodName: 'getHostInfo',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsInternalApiController_generateToken: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"ref":"GenTokenBody"},
        };
        app.post('/host/gen-token',
            ...(fetchMiddlewares<RequestHandler>(InternalApiController)),
            ...(fetchMiddlewares<RequestHandler>(InternalApiController.prototype.generateToken)),

            async function InternalApiController_generateToken(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsInternalApiController_generateToken, request, response });

                const controller = new InternalApiController();

              await templateService.apiHandler({
                methodName: 'generateToken',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsInternalApiController_getGameData: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
        };
        app.post('/game/data',
            authenticateMiddleware([{"bearerAuth":[]}]),
            ...(fetchMiddlewares<RequestHandler>(InternalApiController)),
            ...(fetchMiddlewares<RequestHandler>(InternalApiController.prototype.getGameData)),

            async function InternalApiController_getGameData(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsInternalApiController_getGameData, request, response });

                const controller = new InternalApiController();

              await templateService.apiHandler({
                methodName: 'getGameData',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsInternalApiController_getPlayers: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"ref":"GetPlayersBody"},
        };
        app.post('/host/players',
            authenticateMiddleware([{"bearerAuth":[]}]),
            ...(fetchMiddlewares<RequestHandler>(InternalApiController)),
            ...(fetchMiddlewares<RequestHandler>(InternalApiController.prototype.getPlayers)),

            async function InternalApiController_getPlayers(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsInternalApiController_getPlayers, request, response });

                const controller = new InternalApiController();

              await templateService.apiHandler({
                methodName: 'getPlayers',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa


    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function authenticateMiddleware(security: TsoaRoute.Security[] = []) {
        return async function runAuthenticationMiddleware(request: any, response: any, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            // keep track of failed auth attempts so we can hand back the most
            // recent one.  This behavior was previously existing so preserving it
            // here
            const failedAttempts: any[] = [];
            const pushAndRethrow = (error: any) => {
                failedAttempts.push(error);
                throw error;
            };

            const secMethodOrPromises: Promise<any>[] = [];
            for (const secMethod of security) {
                if (Object.keys(secMethod).length > 1) {
                    const secMethodAndPromises: Promise<any>[] = [];

                    for (const name in secMethod) {
                        secMethodAndPromises.push(
                            expressAuthenticationRecasted(request, name, secMethod[name], response)
                                .catch(pushAndRethrow)
                        );
                    }

                    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

                    secMethodOrPromises.push(Promise.all(secMethodAndPromises)
                        .then(users => { return users[0]; }));
                } else {
                    for (const name in secMethod) {
                        secMethodOrPromises.push(
                            expressAuthenticationRecasted(request, name, secMethod[name], response)
                                .catch(pushAndRethrow)
                        );
                    }
                }
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            try {
                request['user'] = await Promise.any(secMethodOrPromises);

                // Response was sent in middleware, abort
                if (response.writableEnded) {
                    return;
                }

                next();
            }
            catch(err) {
                // Show most recent error as response
                const error = failedAttempts.pop();
                error.status = error.status || 401;

                // Response was sent in middleware, abort
                if (response.writableEnded) {
                    return;
                }
                next(error);
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        }
    }

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

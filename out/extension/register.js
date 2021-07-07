"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerEvent = void 0;
const vscode_1 = require("vscode");
// 注册事件
function registerEvent() {
    // 添加swagger服务地址
    vscode_1.commands.registerCommand('swagger-api-export.add', () => __awaiter(this, void 0, void 0, function* () {
        const server = yield vscode_1.window.showInputBox({ placeHolder: '请输入正确的swagger服务地址' });
        if (!server)
            return;
    }));
}
exports.registerEvent = registerEvent;
//# sourceMappingURL=register.js.map
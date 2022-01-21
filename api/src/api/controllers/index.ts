export * from "./auth.controller"
export * from "./bayi.controller"
export * from "./bolge.controller"
export * from "./dist.controller"
export * from "./user.controller"
export * from "./tapdk.controller"
export * from "./mail.controller"

import {getSource} from "./tapdk.controller"

module.exports = {
    TAPDK : getSource,
    MAIL  : require("./mail.controller")
}
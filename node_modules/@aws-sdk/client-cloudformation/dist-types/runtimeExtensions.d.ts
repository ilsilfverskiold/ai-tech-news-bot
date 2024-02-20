import { CloudFormationExtensionConfiguration } from "./extensionConfiguration";
/**
 * @public
 */
export interface RuntimeExtension {
    configure(extensionConfiguration: CloudFormationExtensionConfiguration): void;
}
/**
 * @public
 */
export interface RuntimeExtensionsConfig {
    extensions: RuntimeExtension[];
}
/**
 * @internal
 */
export declare const resolveRuntimeExtensions: (runtimeConfig: any, extensions: RuntimeExtension[]) => any;

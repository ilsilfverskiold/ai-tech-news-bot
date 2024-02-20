import { CloudFormationExtensionConfiguration } from "./extensionConfiguration";
export interface RuntimeExtension {
  configure(extensionConfiguration: CloudFormationExtensionConfiguration): void;
}
export interface RuntimeExtensionsConfig {
  extensions: RuntimeExtension[];
}
export declare const resolveRuntimeExtensions: (
  runtimeConfig: any,
  extensions: RuntimeExtension[]
) => any;

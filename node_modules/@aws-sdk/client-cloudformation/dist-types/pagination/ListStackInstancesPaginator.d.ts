import { Paginator } from "@smithy/types";
import { ListStackInstancesCommandInput, ListStackInstancesCommandOutput } from "../commands/ListStackInstancesCommand";
import { CloudFormationPaginationConfiguration } from "./Interfaces";
/**
 * @public
 */
export declare const paginateListStackInstances: (config: CloudFormationPaginationConfiguration, input: ListStackInstancesCommandInput, ...rest: any[]) => Paginator<ListStackInstancesCommandOutput>;

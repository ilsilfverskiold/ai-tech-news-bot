import { Paginator } from "@smithy/types";
import { ListTypeRegistrationsCommandInput, ListTypeRegistrationsCommandOutput } from "../commands/ListTypeRegistrationsCommand";
import { CloudFormationPaginationConfiguration } from "./Interfaces";
/**
 * @public
 */
export declare const paginateListTypeRegistrations: (config: CloudFormationPaginationConfiguration, input: ListTypeRegistrationsCommandInput, ...rest: any[]) => Paginator<ListTypeRegistrationsCommandOutput>;

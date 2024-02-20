import { Paginator } from "@smithy/types";
import { ListResourceScansCommandInput, ListResourceScansCommandOutput } from "../commands/ListResourceScansCommand";
import { CloudFormationPaginationConfiguration } from "./Interfaces";
/**
 * @public
 */
export declare const paginateListResourceScans: (config: CloudFormationPaginationConfiguration, input: ListResourceScansCommandInput, ...rest: any[]) => Paginator<ListResourceScansCommandOutput>;

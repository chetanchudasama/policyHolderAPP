import { AxiosResponse } from 'axios';
import { handleUnexpectedStatusResponse } from './default';
import InsurerPortalModel from '@/models/InsurerPortalModel';
import ClaimRequest from '@/models/ClaimTracking/ClaimRequest';
import CoverIncluded from '@/models/ClaimTracking/CoverIncluded';
import EngineerAssigned from '@/models/ClaimTracking/EngineerAssigned';
import EngineerOnTheWay from '@/models/ClaimTracking/EngineerOnTheWay';
import EngineerOnSite from '@/models/ClaimTracking/EngineerOnSite';
import ClaimTrackingModel from '@/models/ClaimTracking/ClaimTrackingModel';
import { ClaimTrackingType } from '@/common/enums';
import ClaimEmergencyDetail from '@/models/ClaimTracking/ClaimEmergencyDetail';
import ClaimVisitComplete from '@/models/ClaimTracking/ClaimVisitComplete';
import PictureUploadModel from '@/models/PictureUploadModel';
import CosmosJobsDbRecordBase from '@/models/CosmosJobsDbRecordBase';
import PolicyHolderApi from '@/api/PolicyHolderApiAxiosPlugin';
import UpdateQuestionModeJobDetailModel from '@/models/claim/UpdateQuestionModeJobDetailModel';
import AddCATInvoiceImageModel from '@/models/claim/AddCATInvoiceImageModel';

export default class JobController {
    public static async AddJob(subDomain: string, insurerPortal: InsurerPortalModel): Promise<boolean> {
        const res: AxiosResponse = await PolicyHolderApi.post<InsurerPortalModel>('Job/AddJob?subDomain=' + encodeURIComponent(subDomain.toString()),
            insurerPortal);
        if (res.status >= 200 && res.status <= 300) {
            return true;
        } else {
            handleUnexpectedStatusResponse(res);
            return false;
        }
    }

    public static async GetSASTokenForBlob(fileName: string): Promise<string> {
        const res: AxiosResponse = await PolicyHolderApi.get('Job/GetSASTokenForBlob?fileName=' + fileName);
        if (res.status === 200) {
            const result = res.data as string;
            if (!result) {
                return "";
            }
            return result;
        } else {
            handleUnexpectedStatusResponse(res);
            return "";
        }
    }

    public static async DeleteBlobImage(url: string): Promise<boolean> {
        const res: AxiosResponse = await PolicyHolderApi.delete('Job/DeleteBlobImage?fileURL=' + url);
        if (res.status >= 200 && res.status < 300) {
            return true;
        } else {
            handleUnexpectedStatusResponse(res);
            return false;
        }
    }

    public static async AddClaimPictures(claimPictures: PictureUploadModel[]): Promise<boolean> {
        const res: AxiosResponse = await PolicyHolderApi.post('Job/AddClaimPictures', claimPictures);
        if (res.status >= 200 && res.status < 300) {
            return true;
        } else {
            handleUnexpectedStatusResponse(res);
            return false;
        }
    }

    public static async GetJobTrackingDocuments(): Promise<ClaimTrackingModel[]> {
        const res: AxiosResponse = await PolicyHolderApi.get('Job/GetJobTrackingDocuments');
        if (res.status === 200) {
            // process document
            const length = res.data.length;

            const claimTrackingModelList: ClaimTrackingModel[] = [];
            const emergencyDetailList = [...new Set(res.data.map((item: any) => item.detailId))];
            emergencyDetailList.forEach((emergencyDetailId) => {
                if (emergencyDetailId !== undefined) {
                    const claimTrackingModel: ClaimTrackingModel = new ClaimTrackingModel();
                    for (let i = 0; i < length; i++) {
                        if ((res.data[i].forEmergencyDetailId &&
                            (emergencyDetailId === res.data[i].forEmergencyDetailId))
                            || (res.data[i].detailId &&
                                (emergencyDetailId === res.data[i].detailId))) {
                            const response = this.castJobDocument(res.data[i]);
                            if (response && res.data[i].type === ClaimTrackingType.TrackClaimRequest) {
                                claimTrackingModel.claimRequest = response;
                            } else if (response && res.data[i].type === ClaimTrackingType.TrackCoverIncluded) {
                                claimTrackingModel.coverIncluded = response;
                            } else if (response && res.data[i].type === ClaimTrackingType.TrackEngineerAssigned) {
                                claimTrackingModel.engineerAssigned = response;
                            } else if (response && res.data[i].type === ClaimTrackingType.TrackEngineerOnTheWay) {
                                claimTrackingModel.engineerOnTheWay = response;
                            } else if (response && res.data[i].type === ClaimTrackingType.TrackEngineerOnSite) {
                                claimTrackingModel.engineerOnSite = response;
                            } else if (response && res.data[i].type === ClaimTrackingType.TrackClaimEmergencyDetail) {
                                claimTrackingModel.claimEmergencyDetail = response;
                            } else if (response && res.data[i].type === ClaimTrackingType.TrackClaimVisitComplete) {
                                claimTrackingModel.claimVisitComplete = response;
                            }
                        }
                    }
                    claimTrackingModelList.push(claimTrackingModel);
                }
            });
            return claimTrackingModelList;
        } else if (res.status === 400 || res.status === 401) {
            // handle 401 status here to skip at global handler
            // not found
            return res.data;
        } else {
            handleUnexpectedStatusResponse(res);
            return res.data;
        }
    }

    public static async GetJobDocument(documentId: string): Promise<CosmosJobsDbRecordBase | null> {
        const res: AxiosResponse = await PolicyHolderApi.get('Job/GetJobDocument?documentId=' + encodeURIComponent(documentId));
        if (res.status === 200) {
            return res.data;
        } else {
            return null;
        }
    }

    public static async GetJobLocation(): Promise<any | null> {
        const res: AxiosResponse = await PolicyHolderApi.get('Job/GetJobLocation');
        if (res.status === 200) {
            return res.data;
        } else {
            return null;
        }
    }

    public static async UpdateQuestionModeJobDetails(subDomain: string, updateQuestionModeJobDetailModel: UpdateQuestionModeJobDetailModel): Promise<boolean> {
        const res: AxiosResponse = await PolicyHolderApi.post<InsurerPortalModel>('Job/UpdateQuestionModeJobDetails?subDomain=' + encodeURIComponent(subDomain.toString()),
        updateQuestionModeJobDetailModel);
        if (res.status >= 200 && res.status <= 300) {
            return true;
        } else {
            handleUnexpectedStatusResponse(res);
            return false;
        }
    }

    public static async AuthoriseCustomerToUploadReceipt(recordId: string): Promise<boolean | string> {
        const res: AxiosResponse = await PolicyHolderApi.get('Job/AuthoriseCustomerToUploadReceipt?recordId=' + recordId);
        if (res.status === 200) {
            const result = res.data as string;
            if (!result) {
                return "";
            }
            return result;
        } else {
            return false;
        }
    }

    public static async GetSASTokenForInvoiceImage(fileName: string): Promise<string> {
        const res: AxiosResponse = await PolicyHolderApi.get('Job/GetSASTokenForInvoiceImage?fileName=' + fileName);
        if (res.status === 200) {
            const result = res.data as string;
            if (!result) {
                return "";
            }
            return result;
        } else {
            handleUnexpectedStatusResponse(res);
            return "";
        }
    }

    public static async SaveCATInvoiceImage(addCustomerReceiptImageModel: AddCATInvoiceImageModel): Promise<boolean> {
        const res: AxiosResponse = await PolicyHolderApi.post<AddCATInvoiceImageModel>('Job/SaveCATInvoiceImage', addCustomerReceiptImageModel);
        return res.status >= 200 && res.status < 300 ? true : false;
    }

    private static castJobDocument(documentJsonConverted: any): any {
        if (!documentJsonConverted) { return; }
        const jobId = documentJsonConverted.jobId;
        if (!jobId) { return; }
        let response = null;
        switch (documentJsonConverted.type) {
            case ClaimTrackingType.TrackClaimRequest:
                response = Object.assign(new ClaimRequest(), documentJsonConverted);
                break;
            case ClaimTrackingType.TrackCoverIncluded:
                response = Object.assign(new CoverIncluded(), documentJsonConverted);
                break;
            case ClaimTrackingType.TrackEngineerAssigned:
                response = Object.assign(new EngineerAssigned(), documentJsonConverted);
                break;
            case ClaimTrackingType.TrackEngineerOnTheWay:
                response = Object.assign(new EngineerOnTheWay(), documentJsonConverted);
                break;
            case ClaimTrackingType.TrackEngineerOnSite:
                response = Object.assign(new EngineerOnSite(), documentJsonConverted);
                break;
            case ClaimTrackingType.TrackClaimEmergencyDetail:
                response = Object.assign(new ClaimEmergencyDetail(), documentJsonConverted);
                break;
            case ClaimTrackingType.TrackClaimVisitComplete:
                response = Object.assign(new ClaimVisitComplete(), documentJsonConverted);
                break;
            default:
                throw new Error("unknown job document type: " + documentJsonConverted.type);
        }
        return response;
    }
}

<template>
 <section role="region" aria-label="Upload Image">
    <div class="upload-images pa-4 " v-bind:style="{ background: environment.Settings.SecondaryColor }">
        <h2 class="header-text">{{headerText}}</h2>  
        <v-text-field label="Upload Files"  @click='pickFile' v-model='imageName' append-icon='attach_file' :hide-details="true" @focus="onFileInputFocus" @keyup.enter.prevent="pickFile" ref="attachFile"></v-text-field>
        <input
            type="file"
            style="display: none"
            ref="image"
            accept="image/*"
            @change="onFilePicked"
            name="image"
            label="Upload Files"
            aria-label="Upload Files"
            :disabled="isUploadInvoiceLink && imageListToUpload.length === 1 && !isInvoiceUploaded ? true : false"
            v-validate ="{ rules: { required: false, image: true, size: environment.LogoSize, mimes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'], ext: ['jpg', 'jpeg', 'png', 'gif'] } }"
        >
        <div class="input-group__details">
            <div class="input-group__messages input-group__error input-group--error" v-bind:style="{ color: environment.Settings.ErrorColor}">
                <span>{{ imageValidationMessage(errors, imageErrorMessage) }}</span>
            </div>
        </div>
        <div class="upload-files mt-5" role="region" aria-label="uploaded images">
            <div  v-for="image in selectedImages" :key="image.imgName" class="mb-4"> 
            <v-card>
                    <v-btn fab small class="elevation-1 white" @click.native.stop="removeImage(image)" @keyup.enter.prevent="removeImage(image)" v-if="!isInvoiceUploaded" :label="`Remove ${image.imgName} image`" :aria-label="`Remove ${image.imgName} image`">
                    <v-icon small v-bind:style="{ color: environment.Settings.ComplementaryColor}">delete</v-icon>
                </v-btn>
                <div class="img-content"> 
                    <img :src="image.imgURL" class="img-responsive" :alt="image.imgName"/>
                </div>  
            </v-card>
            </div> 
        </div>
    </div>
 </section>
</template>

<style scoped>
.upload-images .upload-files{display: flex; flex-wrap:wrap; margin: auto -20px;}
.upload-images .upload-files > div{width: 50%; position: relative;  padding: 0px 20px; display: flex; }
.upload-images .upload-files > div .v-btn{position: absolute; top: -18px; right: -28px; }
.upload-images .upload-files > div .v-card{width: 100%; padding: 15px; height: 200px !important;}
.upload-images .upload-files > div .img-content{display:flex;  position: absolute; left: 15px; right: 15px; top:15px; bottom: 15px;}
.upload-images .upload-files > div .img-content img{margin: auto; max-height: 100%; }
@media(max-width: 420px) {
    .upload-images.pa-4  {padding:8px !important;}
}
.upload-images >>> .header-text {font-size: 1.4rem !important;font-weight: bold;}
</style>
<script src="D:/Projects/PolicyHolderApp/public/azure-storage.blob.js"></script>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { Environment } from '@/common/environment';
import storeGetters from '@/storeGetters';
import JobController from '@/api/jobController';
import Axios from 'axios';
import * as Azure from "@azure/storage-blob";
import Shared from '@/common/shared';

@Component
export default class PictureUpload extends Vue {
    @Prop() private imageListToUpload: string[];
    @Prop() private isImageUploading: boolean;
    @Prop({default: false}) private isUploadInvoiceLink: boolean;
    @Prop({default: ""}) private uploadedInvoiceUrl: string;
    @Prop({default: 'Adding photos makes it much more likely that we can solve your emergency on our first visit'}) private headerText: string;

    private imageSASToken: string = "";
    private imageName: string = '';
    private	imageUrl: string = '';
    private selectedImages: any = [];
    private imageErrorMessage: string = "";
    private isInvoiceUploaded: boolean = false;

    @Watch("uploadedInvoiceUrl")
    private uploadedInvoiceUrlChange() {
        this.setUploadedInvoice();
    }

    private get environment(): Environment {
        return storeGetters.getEnvironment();
    }

    private pickFile() {
        const logoError = this.$validator.errors.items.find((a) => a.field === "image");
        if (logoError) {
            logoError.msg = '';
        }
        const image = (this.$refs.image as any);
        image.value = null;
        image.click();
        const inputElement = (this.$refs.attachFile as any);
        if (inputElement) {
            inputElement.blur();
        }
    }

    private onFilePicked(event: any) {
        if (this.isUploadInvoiceLink && this.isInvoiceUploaded) {
            Shared.confirmationPopup.open('Are you sure you want to overwrite uploaded invoice?', '', '', 'No', 'Yes', this, 'onConfirmFileUpload', event);
        } else {
            this.onConfirmFileUpload(event);
        }
    }

    private GetSASTokenForBlobs(imageURL: any, fileName: any, image: any) {
        JobController.GetSASTokenForBlob(fileName).then((res: string) => {
            if (res !== "") {
                this.imageSASToken = res;
                this.uploadImage(imageURL, fileName, image);
            } else {
                this.$emit('update:isImageUploading', false);
            }
        }).catch((err: any) => {
            // TODO: handle error
            this.$emit('update:isImageUploading', false);
        });
    }

    private uploadImage(imageURL: any, fileName: any, image: any) {
        this.uploadImagetoAzureStorage(this.imageSASToken, imageURL, fileName).then((response) => {
            if (response === true) {
                if (this.isInvoiceUploaded) {
                    this.selectedImages = [];
                }
                this.selectedImages.push(image);
                this.imageListToUpload.push(this.imageSASToken.split("?")[0]);
                this.$emit('update:isImageUploading', false);
            } else {
                this.$emit('update:isImageUploading', false);
            }
            this.isInvoiceUploaded = false;
            this.imageName = '';
            this.imageUrl = '';
            const img = (this.$refs.image as any);
            img.value = null;
        }).catch((err: any) => {
            // TODO: handle error
            this.$emit('update:isImageUploading', false);
            this.imageName = '';
            this.imageUrl = '';
            const img = (this.$refs.image as any);
            img.value = null;
        });
    }

    private convertBase64toBlob(base64Data: any) {
        const pattern = "data:(.*);base64,";

        const regex = new RegExp(pattern);
        const match: any = regex.exec(base64Data);
        if (match.length > 0) {
            base64Data = base64Data.replace(match[0], "").replace(" ", "+");
        }
        const sliceSize = 1024;
        const byteCharacters = atob(base64Data);
        const bytesLength = byteCharacters.length;
        const slicesCount = Math.ceil(bytesLength / sliceSize);
        const byteArrays = new Array(slicesCount);

        for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
            const begin = sliceIndex * sliceSize;
            const end = Math.min(begin + sliceSize, bytesLength);

            const bytes = new Array(end - begin);
            for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
                bytes[i] = byteCharacters[offset].charCodeAt(0);
            }
            byteArrays[sliceIndex] = new Uint8Array(bytes);
        }
        return new Blob(byteArrays);
    }

    // Upload Image to AzureBlobStorage
    private async uploadImagetoAzureStorage(SAStoken: any, imageURL: any, fileName: any) {
        const pipeline = Azure.StorageURL.newPipeline(new Azure.AnonymousCredential());
        const splitSAStoken = SAStoken.split("/" + fileName);
        const url: any = splitSAStoken[0] + splitSAStoken[1];
        const blobServiceURL: any = new Azure.ServiceURL(url, pipeline);
        const blockBlobURL = Azure.BlockBlobURL.fromContainerURL(blobServiceURL, fileName);
        const blobContent: any = this.convertBase64toBlob(imageURL);
        const uploadImageResponse = await Azure.uploadBrowserDataToBlockBlob(Azure.Aborter.none, blobContent, blockBlobURL);
        return uploadImageResponse._response.status === 201 ? true : false;
    }

    // return validation message on image selection if any.
    private imageValidationMessage(err: any, imageErrorMessage: any) {
        if (err && err.collect("image").length > 0) {
            const message: string = err.collect("image")[0];
            this.imageErrorMessage = message;
            return this.imageErrorMessage;
        } else if (imageErrorMessage !== "") {
            this.imageErrorMessage = imageErrorMessage;
            return this.imageErrorMessage;
        }
    }

    private removeImage(img: any) {
        if (this.appInEditMode) {
            this.imageErrorMessage = "";
            const itemToRmove = this.selectedImages.find((e: any) => e.imgName === img.imgName);
            if (itemToRmove !== undefined) {
              this.selectedImages.splice(this.selectedImages.indexOf(itemToRmove), 1);
            }
            // remove image from list of to be uploaded images.
            delete this.imageListToUpload[img.imgName];
            this.imageName = '';
            this.imageUrl = '';
            const image = (this.$refs.image as any);
            image.value = null;
        } else {
            const url: string = this.imageSASToken.split("?")[0];
            // remove image from list of to be uploaded images.
            const itemToRmoveFromUpload = this.imageListToUpload.filter((e: any) => e.includes(img.imgName));
            itemToRmoveFromUpload.forEach((item) => {
                JobController.DeleteBlobImage(item).then((res) => {
                    if (res) {
                        this.imageErrorMessage = "";
                        const itemToRmove = this.selectedImages.find((e: any) => e.imgName === img.imgName);
                        if (itemToRmove !== undefined) {
                            this.selectedImages.splice(this.selectedImages.indexOf(itemToRmove), 1);
                        }
                        this.imageListToUpload.splice(this.imageListToUpload.indexOf(item), 1);
                        this.imageName = '';
                        this.imageUrl = '';
                        const image = (this.$refs.image as any);
                        image.value = null;
                    }
                }).catch((err: any) => {
                    // TODO: handle error
                });
            });
        }
    }

    private get appInEditMode(): boolean {
      return this.environment.AppMode === 'edit';
    }

    private GetSASTokenForInvoiceImage(imageURL: any, fileName: any, image: any) {
        JobController.GetSASTokenForInvoiceImage(fileName).then((res: string) => {
            if (res !== "") {
                this.imageSASToken = res;
                this.uploadImage(imageURL, fileName, image);
            } else {
                this.$emit('update:isImageUploading', false);
            }
        }).catch((err: any) => {
            // TODO: handle error
            this.$emit('update:isImageUploading', false);
        });
    }

    private onConfirmFileUpload(event: any) {
        this.imageErrorMessage = "";
        const fileList: any = event.target.files;
        const self = this;
        if (self.selectedImages.length > 10) {
            this.imageValidationMessage(null, "Maximum photo attachment limit is 10.");
        } else {
            if (fileList.length + self.selectedImages.length > 10) {
                this.imageValidationMessage(null, "Maximum photo attachment limit is 10.");
            } else {
                for (const file of fileList) {
                    const LogoSize: number = this.environment.LogoSize;
                    if ((file.size / 1048576) > (LogoSize / 1024)) {
                        return;
                    }
                    if (file !== undefined) {
                        const fileName = file.name.split(' ').join('_');
                        self.imageName = fileName;
                        if (fileName.lastIndexOf('.') <= 0) {
                            return;
                        }
                        const existingFile: any = self.selectedImages.find((e: any) => e.imgName === fileName);
                        if (existingFile) {
                            this.imageValidationMessage(null, "The image with name " + fileName + " already exist.");
                        } else {
                            this.imageErrorMessage = "";
                            const fr: any = new FileReader ();
                            fr.readAsDataURL(file);
                            fr.addEventListener('load', () => {
                                if (!this.appInEditMode) {
                                    this.$emit('update:isImageUploading', true);
                                }
                                self.imageUrl = fr.result;
                                const image: any = {};
                                image.imgName = fileName;
                                image.imgURL = self.imageUrl;
                                if (this.appInEditMode) {
                                    self.selectedImages.push(image);
                                    self.imageListToUpload[fileName] = fr.result;
                                    self.imageName = '';
                                    this.imageUrl = '';
                                    const img = (this.$refs.image as any);
                                    img.value = null;
                                } else {
                                    if (this.isUploadInvoiceLink) {
                                        this.GetSASTokenForInvoiceImage(self.imageUrl, fileName, image);
                                    } else {
                                        this.GetSASTokenForBlobs(self.imageUrl, fileName, image);
                                    }
                                }
                            });
                        }
                    }
                }
            }
        }
    }

    private setUploadedInvoice() {
        const url = this.uploadedInvoiceUrl;
        const splitSAStoken = url.split('?')[0];
        const fileName = splitSAStoken.substring(splitSAStoken.lastIndexOf('/')).split("/")[1];
        this.selectedImages.push({imgName: fileName, imgURL: url});
        this.isInvoiceUploaded = true;
    }

    private onFileInputFocus() {
        if (!this.imageName) {
            this.pickFile();
        }
    }
}
</script>
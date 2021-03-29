import { Body, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { get } from 'lodash'
import { Model } from "mongoose";
export class CrudPlaceholderDto {
    fake?: string;
    [key: string]: any;
}
export class CrudService {
    constructor(private readonly model: Model<any>) { }
    async createOne(data: CrudPlaceholderDto): Promise<any> {
        return this.model.create(data)
    }
    async deleteOneById(id: string) {
        return this.model.findByIdAndDelete(id)
    }
    async updateOneById(id: string, data: CrudPlaceholderDto) {
        return this.model.findByIdAndUpdate(id, data)
    }
    async findOneById(id: string) {
        return this.model.findById(id)
    }
    async findAll(pageSize: number, page: number) {
        const allPage = await this.model.find().countDocuments((err, number) => number)
        return { data: await this.model.find().limit(pageSize).skip((page - 1) * pageSize), pages: allPage, curentPage: page }
    }
}

export class CrudController {
    private service: CrudService
    constructor(service?: CrudService) {
        this.service = service
    }

    @Post("createOne")
    @ApiOperation({
        summary: "create a record / 创建一条记录"
    })
    public async createOne(@Body() body: CrudPlaceholderDto) {
        return this.service.createOne(body)
    }

    @Delete("delete/:id")
    @ApiOperation({
        summary: "delete a record by id / 根据id删除记录"
    })
    public async deleteOneById(@Param("id") id: string) {
        return this.service.deleteOneById(id)
    }

    @Put("update/:id")
    @ApiOperation({
        summary: "update a record by id / 根据id修改记录"
    })
    public async updateOneById(@Param("id") id: string, @Body() data: CrudPlaceholderDto) {
        return this.service.updateOneById(id, data)
    }

    @Get("find/:id")
    @ApiOperation({
        summary: "find a record by id / 根据id 查找记录"
    })
    public async findOneById(@Param("id") id: string) {
        return this.service.findOneById(id)
    }

    @Get("find/:size/:page")
    @ApiOperation({
        summary: "find all records / 查询所有记录"
    })
    public async findAll(@Param("size") size: string, @Param("page") page: number) {
        return this.service.findAll(Number(size), Number(page))
    }
}
const methods = [
    "createOne",
    'updateOneById'
]
function cloneDecorators(from, to) {
    Reflect.getMetadataKeys(from).forEach(key => {
        const value = Reflect.getMetadata(key, from)
        Reflect.defineMetadata(key, value, to)
    })
}
function clonePropDecorators(from, to, name) {
    Reflect.getMetadataKeys(from, name).forEach(key => {
        const value = Reflect.getMetadata(key, from, name)
        Reflect.defineMetadata(key, value, to, name)
    })
}
export const crud = (options: { model: any }): ClassDecorator => (target) => {
    const controller = target.prototype;
    const crudController = new CrudController();
    methods.forEach(method => {
        controller[method] = (...args) => {
            return crudController[method].apply(this, args)
        }

        Object.defineProperty(controller[method], 'name', {
            value: method
        })

        // clone instance decorators
        cloneDecorators(crudController, controller)
        cloneDecorators(crudController[method], controller[method])
        // clone instance method decorators
        clonePropDecorators(crudController, controller, method)
        // clone class "method" decorators
        clonePropDecorators(CrudController, target, method)

        // get exists param types
        const types: [] = Reflect.getMetadata("design:paramtypes", controller, method)

        Reflect.decorate([
            // replace fake dto to real dto
            Reflect.metadata("design:paramtypes", types.map((v: any) => {
                if (get(v, 'name') === CrudPlaceholderDto.name) {
                    return get(options, `routes.${method}.dto`, options.model)
                }
                return v
            })),
            ...get(options, `routes.${method}.decorators`, [])
        ], controller, method, Object.getOwnPropertyDescriptor(controller, method))
    })
    controller.createOne = crudController.createOne;
    controller.updateOneById = crudController.updateOneById;
}
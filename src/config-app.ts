import { ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";


export const ConfigMongoDB =  MongooseModule.forRootAsync({
    useFactory:async (configService: ConfigService) => ({
      uri: configService.get<string>('MONGODB_URI'),
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }),
    inject: [ConfigService],
})
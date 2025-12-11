import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { successContent } from "@/lib/game-data";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { CheckCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function SuccessPage() {
    const imageData = PlaceHolderImages.find(img => img.id === successContent.image.id);

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-background">
            <Card className="w-full max-w-2xl animate-fade-in shadow-lg">
                <CardHeader className="text-center">
                    <div className="flex justify-center items-center gap-4">
                        <CheckCircle className="w-12 h-12 text-green-400"/>
                        <h1 className="text-4xl font-bold text-accent">You Survived</h1>
                    </div>
                </CardHeader>
                <CardContent>
                    {imageData && (
                        <div className="relative w-full h-64 md:h-80 rounded-md overflow-hidden my-6 shadow-inner">
                            <Image
                                src={imageData.imageUrl}
                                alt={imageData.description}
                                fill
                                className="object-contain"
                                data-ai-hint={imageData.imageHint}
                                priority
                            />
                        </div>
                    )}
                    <p className="text-lg text-foreground/90 text-center">{successContent.text}</p>
                </CardContent>
                <CardFooter className="justify-center">
                    <Button asChild size="lg">
                        <Link href="/">Play Again?</Link>
                    </Button>
                </CardFooter>
            </Card>
        </main>
    );
}

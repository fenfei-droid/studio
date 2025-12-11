import { gameData, type Choice } from '@/lib/game-data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { notFound, redirect } from 'next/navigation';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Timer } from '@/components/game/timer';
import { MoveRight } from 'lucide-react';
import { DynamicDescription } from '@/components/game/dynamic-description';
import { Suspense } from 'react';

function ChoiceButton({ choice, nodeId }: { choice: Choice; nodeId: string }) {
  const nextHref = choice.isCorrect
    ? (choice.nextNode === 'success' ? '/success' : `/game/${choice.nextNode}`)
    : `/game-over?from=${nodeId}&consequence=${encodeURIComponent(choice.consequence || '')}`;

  return (
    <Button asChild variant="outline" className="justify-start text-left h-auto py-3 group hover:bg-accent/10 hover:border-accent">
      <Link href={nextHref}>
        <div className="flex items-center w-full">
          <span className="flex-grow">{choice.text}</span>
          <MoveRight className="w-5 h-5 ml-4 text-accent/50 transition-transform group-hover:translate-x-2 group-hover:text-accent" />
        </div>
      </Link>
    </Button>
  );
}


export default function GamePage({ params }: { params: { nodeId: string } }) {
  const { nodeId } = params;
  const node = gameData[nodeId];

  if (!node) {
    notFound();
  }

  const imageData = PlaceHolderImages.find(img => img.id === node.image.id);

  async function handleTimeUp() {
    'use server';
    redirect(`/game-over?from=${nodeId}&reason=timeout`);
  };
  
  const previousChoicesMap: Record<string, string[]> = {
    'node-2': ['Threw a patient file at the nurse to escape.'],
    'node-3': ['Threw a patient file at the nurse to escape.', 'Hid in a patient room instead of taking the stairs or elevator.'],
    'node-4': ['Threw a patient file at the nurse to escape.', 'Hid in a patient room.', 'Pressed into a dark corner behind a door to avoid detection.'],
  };
  const previousChoices = previousChoicesMap[nodeId] || [];

  return (
    <>
      {node.type === 'decision' && <Timer onTimeUp={handleTimeUp} />}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start animate-fade-in">
        <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden shadow-lg shadow-black/50 animate-flicker">
          {imageData && (
            <Image
              src={imageData.imageUrl}
              alt={imageData.description}
              fill
              className="object-contain"
              data-ai-hint={imageData.imageHint}
              priority
            />
          )}
        </div>
        <Card className="bg-card/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <p className="text-lg leading-relaxed text-foreground/90">{node.text}</p>
            {node.scenarioForAI && (
              <Suspense>
                <DynamicDescription scenario={node.scenarioForAI} previousChoices={previousChoices} />
              </Suspense>
            )}
          </CardContent>
          <CardFooter className="flex flex-col items-stretch gap-3">
            {node.type === 'intro' && node.nextNode && (
              <Button asChild size="lg" className="w-full group">
                <Link href={`/game/${node.nextNode}`}>
                  Continue
                  <MoveRight className="ml-2 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            )}
            {node.type === 'decision' && node.choices && node.choices.map((choice, index) => (
              <ChoiceButton key={index} choice={choice} nodeId={nodeId} />
            ))}
          </CardFooter>
        </Card>
      </div>
    </>
  );
}

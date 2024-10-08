'use client';
import React, { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import p5Types from 'p5';

interface ComponentProps { }

const Sketch = dynamic(() => import('react-p5').then((mod) => mod.default), {
    ssr: false,
});

class CodeLine {
    private p5: p5Types;
    private x: number;
    private y: number;
    private speed: number;
    private length: number;
    private text: string;

    constructor(p5: p5Types) {
        this.p5 = p5;
        this.reset();
    }

    reset(): void {
        this.x = this.p5.random(this.p5.width);
        this.y = this.p5.random(-100, -10);
        this.speed = this.p5.random(1, 3);
        this.length = this.p5.random(10, 30);
        this.text = this.generateRandomCode();
    }

    move(): void {
        this.y += this.speed;
        if (this.y > this.p5.height) {
            this.reset();
        }
    }

    display(): void {
        this.p5.fill(255, 255, 255, 100);
        this.p5.textSize(12);
        this.p5.text(this.text, this.x, this.y);
    }

    private generateRandomCode(): string {
        const codeSnippets = ['function()', 'if (condition)', 'for (let i = 0;', '} else {', 'const data =', '=> {', 'return', 'class', 'import'];
        return this.p5.random(codeSnippets);
    }
}

const CodeAnimation: React.FC<ComponentProps> = () => {
    const codeLines = useRef<CodeLine[]>([]);

    const setup = (p5: p5Types, canvasParentRef: Element): void => {
        p5.createCanvas(p5.windowWidth, p5.windowHeight).parent(canvasParentRef);
        for (let i = 0; i < 50; i++) {
            codeLines.current.push(new CodeLine(p5));
        }
    };

    const draw = (p5: p5Types): void => {
        p5.clear();
        codeLines.current.forEach(line => {
            line.move();
            line.display();
        });
    };

    const windowResized = (p5: p5Types): void => {
        p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
    };

    useEffect(() => {
        const icons = ['<>', '{}', '()', '[]', '//'];
        const iconContainer = document.getElementById('floatingIcons');
        if (iconContainer) {
            for (let i = 0; i < 20; i++) {
                const icon = document.createElement('div');
                icon.classList.add('floating-icon');
                icon.textContent = icons[Math.floor(Math.random() * icons.length)];
                icon.style.left = `${Math.random() * 100}%`;
                icon.style.top = `${Math.random() * 100}%`;
                icon.style.animationDelay = `${Math.random() * 5}s`;
                iconContainer.appendChild(icon);
            }
        }

        return () => {
            // Clean up floating icons when component unmounts
            if (iconContainer) {
                iconContainer.innerHTML = '';
            }
        };
    }, []);

    return (
        <div>
            <Sketch setup={setup} draw={draw} windowResized={windowResized} />
            <div id="floatingIcons" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}></div>
        </div>
    );
};

export default CodeAnimation;
using ClipLazor.Components;
using Microsoft.Extensions.DependencyInjection;

namespace ClipLazor.Extention
{
    public static class ClipLazorExtention
    {
        public static IServiceCollection AddClipboard(this IServiceCollection services) =>
            services.AddScoped<IClipLazor,Components.ClipLazor>();
    }
}
